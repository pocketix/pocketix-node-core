import * as http from 'http';
import * as https from 'https';

import {Influx} from '../api/Influx';
import {InfluxQueryInputParam, InputData, Operation} from '../api/influxTypes';
jest.mock('@influxdata/influxdb-client');
import {
    InfluxDB,
    Point,
    QueryApi,
    WriteApi,
    fluxExpression,
    fluxString,
    FluxParameterLike,
    toFluxValue,
    fluxDateTime
} from '@influxdata/influxdb-client';
import {MockPoint, queryApi, writeApi} from './mockData';


beforeEach(() => {
    const mockedPoint = Point as jest.Mock;
    const mockedFluxString = fluxString as jest.Mock;
    const mockedFluxExpression = fluxExpression as jest.Mock;
    const mockedToFluxValue = toFluxValue as jest.Mock;
    const mockedFluxDateTime = fluxDateTime as jest.Mock;

    mockedPoint.mockReturnValueOnce(new MockPoint());
    mockedFluxString.mockImplementation((parameter) => `\"${parameter.toString()}\"` as unknown as FluxParameterLike);
    mockedFluxExpression.mockImplementation((parameter) => parameter.toString());
    mockedToFluxValue.mockImplementation((parameter) => parameter.toString() as unknown as FluxParameterLike);
    mockedFluxDateTime.mockImplementation((parameter) => parameter.toString() as unknown as FluxParameterLike);

    jest.spyOn(InfluxDB.prototype, 'getWriteApi').mockReturnValue(writeApi as unknown as WriteApi);
    jest.spyOn(InfluxDB.prototype, 'getQueryApi').mockReturnValue(queryApi as unknown as QueryApi);
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('Test correct Agent was created', () => {
    it('Creates correct http agent', async () => {
        const influx = new Influx('http://localhost:8086', 'test', 'test', 'test');
        // tslint:disable-next-line
        expect((influx['createAgent']('http://localhost:8086')) instanceof http.Agent).toBe(true);
    });

    it('Creates correct https agent', async () => {
        const influx = new Influx('https://localhost:8086', 'test', 'test', 'test');
        // tslint:disable-next-line
        expect((influx['createAgent']('https://localhost:8086')) instanceof https.Agent).toBe(true);
    });
});

describe('Test inserting data', () => {
    it('Should call writePoints correctly', async () => {
        const influx = new Influx('http://localhost:8086', 'test', 'test', 'test');

        const data = {
            deviceUid: 'BE7A020000000578',
            deviceType: 'waterLevel',
            battery: '3.4',
            tst: new Date(Date.now())
        } as InputData;

        await influx.saveOne(data);

        delete data[influx.measurementDefault];
        data.host = influx.host;

        const point = new MockPoint();
        const battery = ['float', 'battery', '3.4'];
        delete data.battery;

        point.storage = Object.entries(data);
        point.storage.push(battery);
        point.storage.sort();
        expect(writeApi.writePoints).toBeCalledTimes(1);
        expect(writeApi.writePoints).toHaveBeenCalledWith([point]);
    });
});

describe('Test inserting string data', () => {
    it('Should create a string field', async () => {
        const influx = new Influx('http://localhost:8086', 'test', 'test', 'test');

        const data = {
            deviceUid: 'BE',
            deviceType: 'waterLevel',
            string: 'Some long text like string',
            tst: new Date(Date.now())
        } as InputData;

        await influx.saveOne(data);
        const point = new MockPoint();
        point.timestamp(data.tst as Date).tag('host', influx.host).tag('deviceType', data.deviceType);
        point.stringField('string', data.string);

        expect(writeApi.writePoints).toBeCalledTimes(1);
        expect(writeApi.writePoints).toHaveBeenCalledWith([point]);
    });
});

describe('Test inserting object data', () => {
    it('Should convert the object to string', async () => {
        const influx = new Influx('http://localhost:8086', 'test', 'test', 'test');

        const data = {
            deviceUid: 'BE',
            deviceType: 'waterLevel',
            object: {key: 'Some long text like string', anotherKey: 545},
            tst: new Date(Date.now())
        } as InputData;

        await influx.saveOne(data);
        const point = new MockPoint();
        point.timestamp(data.tst as Date).tag('host', influx.host).tag('deviceType', data.deviceType);
        point.stringField('object', JSON.stringify(data.object));

        expect(writeApi.writePoints).toBeCalledTimes(1);
        expect(writeApi.writePoints).toHaveBeenCalledWith([point]);
    });
    it('Should convert even deeply nested objects', async () => {
        const influx = new Influx('http://localhost:8086', 'test', 'test', 'test');

        const data = {
            deviceUid: 'BE',
            deviceType: 'waterLevel',
            nestedObject: {key: {nestedKey: 'Some long text like string'}, anotherKey: 545},
            tst: new Date(Date.now())
        } as InputData;

        await influx.saveOne(data);
        const point = new MockPoint();
        point.timestamp(data.tst as Date).tag('host', influx.host).tag('deviceType', data.deviceType);
        point.stringField('nestedObject', JSON.stringify(data.nestedObject));

        expect(writeApi.writePoints).toBeCalledTimes(1);
        expect(writeApi.writePoints).toHaveBeenCalledWith([point]);
    });
});

describe('Test inserting numerical data', () => {
    it('Insert simple float values passed as number', async () => {
        const influx = new Influx('http://localhost:8086', 'test', 'test', 'test');

        const data = {
            deviceUid: 'BE',
            deviceType: 'waterLevel',
            battery: 52.5,
            tst: new Date(Date.now())
        } as InputData;

        await influx.saveOne(data);
        const point = new MockPoint();
        point.timestamp(data.tst as Date).tag('host', influx.host).tag('deviceType', data.deviceType);
        point.floatField('battery', data.battery);

        expect(writeApi.writePoints).toBeCalledTimes(1);
        expect(writeApi.writePoints).toHaveBeenCalledWith([point]);
    });

    it('Insert simple float values passed as a string', () => {
        const influx = new Influx('http://localhost:8086', 'test', 'test', 'test');

        const data = {
            deviceUid: 'BE',
            deviceType: 'waterLevel',
            stringBattery: '52.5',
            tst: new Date(Date.now())
        } as InputData;

        influx.saveOne(data);
        const point = new MockPoint();
        point.timestamp(data.tst as Date).tag('host', influx.host).tag('deviceType', data.deviceType);
        point.floatField('stringBattery', data.stringBattery);

        expect(writeApi.writePoints).toBeCalledTimes(1);
        expect(writeApi.writePoints).toHaveBeenCalledWith([point]);
    });

    it('Try to insert NaN', async () => {
        const influx = new Influx('http://localhost:8086', 'test', 'test', 'test');

        const data = {
            deviceUid: 'BE',
            deviceType: 'waterLevel',
            nan: NaN,
            tst: new Date(Date.now())
        } as InputData;

        await influx.saveOne(data);
        const point = new MockPoint();
        point.timestamp(data.tst as Date).tag('host', influx.host).tag('deviceType', data.deviceType);

        expect(writeApi.writePoints).toBeCalledTimes(1);
        expect(writeApi.writePoints).toHaveBeenCalledWith([point]);
    });

    it('Try to insert null', async () => {
        const influx = new Influx('http://localhost:8086', 'test', 'test', 'test');

        const data = {
            deviceUid: 'BE',
            deviceType: 'waterLevel',
            null: null,
            tst: new Date(Date.now())
        } as InputData;

        await influx.saveOne(data);
        const point = new MockPoint();
        point.timestamp(data.tst as Date).tag('host', influx.host).tag('deviceType', data.deviceType);

        expect(writeApi.writePoints).toBeCalledTimes(1);
        expect(writeApi.writePoints).toHaveBeenCalledWith([point]);
    });

    it('Try to "0"', async () => {
        const influx = new Influx('http://localhost:8086', 'test', 'test', 'test');

        const data = {
            deviceUid: 'BE',
            deviceType: 'waterLevel',
            zero: '0',
            tst: new Date(Date.now())
        } as InputData;

        await influx.saveOne(data);
        const point = new MockPoint();
        point.timestamp(data.tst as Date).tag('host', influx.host).tag('deviceType', data.deviceType);
        point.floatField('zero', data.zero);

        expect(writeApi.writePoints).toBeCalledTimes(1);
        expect(writeApi.writePoints).toHaveBeenCalledWith([point]);
    });
});

describe('Test inserting boolean data', () => {
    it('Should create a boolean field', async () => {
        const influx = new Influx('http://localhost:8086', 'test', 'test', 'test');

        const data = {
            deviceUid: 'BE',
            deviceType: 'waterLevel',
            bool: true,
            tst: new Date(Date.now())
        } as InputData;

        await influx.saveOne(data);
        const point = new MockPoint();
        point.timestamp(data.tst as Date).tag('host', influx.host).tag('deviceType', data.deviceType);
        point.booleanField('bool', data.bool);

        expect(writeApi.writePoints).toBeCalledTimes(1);
        expect(writeApi.writePoints).toHaveBeenCalledWith([point]);
    });
});

describe('Test querying without aggregations', () => {
    it('Queries using only SimpleSensors', async () => {
        const influx = new Influx('http://localhost:8086', 'test', 'test', 'test');

        await influx.query(['BE']);

        const query = 'from(bucket: "test")\n' +
            '\t\t\t\t\t|> range(start: -30d)\n' +
            '\t\t\t\t\t|> filter(fn: (r) => r["_measurement"] == "BE")\n' +
            '\t\t\t\t\t\n' +
            '\t\t\t\t\t|> drop(columns: ["_start", "_stop", "host"])\n' +
            '\t\t\t\t\t|> pivot(columnKey: ["_field"], rowKey: ["_measurement", "_time"], valueColumn: "_value")\n' +
            '\t\t\t\t\t|> rename(columns: {_time: "time", _measurement: "sensor"})\n' +
            '\t\t\t\t\t|> group(columns: ["measurement"], mode: "by")\n' +
            '\t\t\t';

        expect(queryApi.collectRows).toBeCalledTimes(1);
        expect(queryApi.collectRows.mock.calls[0][0].replace(/\s/g, '')).toEqual(query.replace(/\s/g, ''));
    });
    it('Queries using only one SensorsWithFields with one sensor and one field', async () => {
        const influx = new Influx('http://localhost:8086', 'test', 'test', 'test');

        await influx.query({BE: ['first', 'second']});

        const query = 'from(bucket: "test")\n' +
            '\t\t\t\t\t|> range(start: -30d)\n' +
            '\t\t\t\t\t|> filter(fn: (r) => (r[\"_measurement\"] == \"BE\" and (r[\"_field\"] == \"first\" or r[\"_field\"] == \"second\")))\n' +
            '\t\t\t\t\t\n' +
            '\t\t\t\t\t|> drop(columns: ["_start", "_stop", "host"])\n' +
            '\t\t\t\t\t|> pivot(columnKey: ["_field"], rowKey: ["_measurement", "_time"], valueColumn: "_value")\n' +
            '\t\t\t\t\t|> rename(columns: {_time: "time", _measurement: "sensor"})\n' +
            '\t\t\t\t\t|> group(columns: ["measurement"], mode: "by")\n' +
            '\t\t\t';

        expect(queryApi.collectRows).toBeCalledTimes(1);
        expect(queryApi.collectRows.mock.calls[0][0].replace(/\s/g, '')).toEqual(query.replace(/\s/g, ''));
    });
    it('Queries using two SimpleSensors', async () => {
        const influx = new Influx('http://localhost:8086', 'test', 'test', 'test');

        await influx.query(['first', 'second']);

        const query = 'from(bucket: "test")\n' +
            '\t\t\t\t\t|> range(start: -30d)\n' +
            '\t\t\t\t\t|> filter(fn: (r) => r[\"_measurement\"] == \"first\" or r[\"_measurement\"] == \"second\")\n' +
            '\t\t\t\t\t\n' +
            '\t\t\t\t\t|> drop(columns: ["_start", "_stop", "host"])\n' +
            '\t\t\t\t\t|> pivot(columnKey: ["_field"], rowKey: ["_measurement", "_time"], valueColumn: "_value")\n' +
            '\t\t\t\t\t|> rename(columns: {_time: "time", _measurement: "sensor"})\n' +
            '\t\t\t\t\t|> group(columns: ["measurement"], mode: "by")\n' +
            '\t\t\t';

        expect(queryApi.collectRows).toBeCalledTimes(1);
        expect(queryApi.collectRows.mock.calls[0][0].replace(/\s/g, '')).toEqual(query.replace(/\s/g, ''));
    });
});
describe('Test differenceBetweenFirstAndLast query generation', () => {
    it('Generates correct query', async () => {
        const influx = new Influx('http://localhost:8086', 'test', 'test', 'test');
        await influx.differenceBetweenFirstAndLast({
            operation: '', bucket: 'Home', param: {
                sensors: {Arduino: ['light']},
            } as InfluxQueryInputParam
        });

        const query = 'data = from(bucket: "Home")\n' +
            '  |> range(start: -30d)\n' +
            '  |> filter(fn: (r) => (r["_measurement"] == "Arduino" and (r["_field"] == "light")))\n' +
            '  \n' +
            'first = data\n' +
            '  |> first()\n' +
            'last = data\n' +
            '  |> last()\n' +
            '  \n' +
            'union(tables: [first, last])\n' +
            '  |> sort(columns: ["_time"])\n' +
            '  |> difference()\n' +
            '  |> drop(columns: ["_start", "_stop", "host"])\n' +
            '  |> pivot(columnKey: ["_field"], rowKey: ["_measurement", "_time"], valueColumn: "_value")\n' +
            '  |> rename(columns: {_time: "time", _measurement: "sensor"})\n' +
            '  |> group(columns: ["measurement"], mode: "by")  ';

        expect(queryApi.collectRows).toBeCalledTimes(1);
        expect(queryApi.collectRows.mock.calls[0][0].replace(/\s/g, '')).toEqual(query.replace(/\s/g, ''));
    });
    it('Generates correct query with Simple Sensor', async () => {
        const influx = new Influx('http://localhost:8086', 'test', 'test', 'test');
        await influx.differenceBetweenFirstAndLast({
            operation: '', bucket: 'Home', param: {
                sensors: ['Arduino'],
            } as InfluxQueryInputParam
        });

        const query = 'data = from(bucket: "Home")\n' +
            '  |> range(start: -30d)\n' +
            '  |> filter(fn: (r) => r["_measurement"] == "Arduino")\n' +
            '  \n' +
            'first = data\n' +
            '  |> first()\n' +
            'last = data\n' +
            '  |> last()\n' +
            '  \n' +
            'union(tables: [first, last])\n' +
            '  |> sort(columns: ["_time"])\n' +
            '  |> difference()\n' +
            '  |> drop(columns: ["_start", "_stop", "host"])\n' +
            '  |> pivot(columnKey: ["_field"], rowKey: ["_measurement", "_time"], valueColumn: "_value")\n' +
            '  |> rename(columns: {_time: "time", _measurement: "sensor"})\n' +
            '  |> group(columns: ["measurement"], mode: "by")';

        expect(queryApi.collectRows).toBeCalledTimes(1);
        expect(queryApi.collectRows.mock.calls[0][0].replace(/\s/g, '')).toEqual(query.replace(/\s/g, ''));
    });
});

describe('Test lastOccurrenceOfValue query generation', () => {
    it('Generates correct query', async () => {
        const influx = new Influx('http://localhost:8086', 'test', 'test', 'test');
        await influx.lastOccurrenceOfValue({
            operation: '', bucket: 'Home', param: {
                sensors: ['Arduino'],
            } as InfluxQueryInputParam
        }, 'eq', {light: 0});

        const query = `from(bucket:"Home")
                          |> range(start:-30d)
                          |> filter(fn:(r)=>r["_measurement"]=="Arduino")
                          |> filter(fn:(r)=>(r["_field"]=="light"and r["_value"] == 0))
                          |> last()
                          |> drop(columns:["_start","_stop","host"])
                          |> pivot(columnKey:["_field"],rowKey:["_measurement","_time"],valueColumn:"_value")
                          |> rename(columns:{_time:"time",_measurement:"sensor"})
                          |> group(columns:["measurement"],mode:"by")`;

        expect(queryApi.collectRows).toBeCalledTimes(1);
        expect(queryApi.collectRows.mock.calls[0][0].replace(/\s/g, '')).toEqual(query.replace(/\s/g, ''));
    });

    it('Generates correct query bound by time', async () => {
        const influx = new Influx('http://localhost:8086', 'test', 'test', 'test');
        const from = new Date();
        const to = new Date();
        from.setHours(from.getHours() - 1);

        await influx.lastOccurrenceOfValue({
            operation: '', bucket: 'Home', param: {
                sensors: ['Arduino'],
                from: from.toISOString(),
                to: to.toISOString()
            } as InfluxQueryInputParam
        }, 'gt', {light: 0});

        const query = `from(bucket:"Home")
                          |> range(start: ${from.toISOString()}, stop: ${to.toISOString()})
                          |> filter(fn:(r)=>r["_measurement"]=="Arduino")
                          |> filter(fn:(r)=>(r["_field"]=="light"and r["_value"] > 0))
                          |> last()
                          |> drop(columns:["_start","_stop","host"])
                          |> pivot(columnKey:["_field"],rowKey:["_measurement","_time"],valueColumn:"_value")
                          |> rename(columns:{_time:"time",_measurement:"sensor"})
                          |> group(columns:["measurement"],mode:"by")`;

        expect(queryApi.collectRows).toBeCalledTimes(1);
        expect(queryApi.collectRows.mock.calls[0][0].replace(/\s/g, '')).toEqual(query.replace(/\s/g, ''));
    });
});

describe('Test parameterAggregationWithMultipleStarts query generation', () => {
    it('Generates correct query', async () => {
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const lastWeek = new Date(startOfDay.getTime() - 7 * 24 * 60 * 60 * 1000);
        // this should be a month, not every month has 30 days
        const lastMonth = new Date(startOfDay.getTime() - 30 * 24 * 60 * 60 * 1000);
        const to = new Date().toISOString();

        const influx = new Influx('http://localhost:8086', 'test', 'test', 'test');
        await influx.parameterAggregationWithMultipleStarts({
            operation: '',
            bucket: 'Home',
            param: {
                from: lastMonth.toISOString(),
                to,
                sensors: ['Arduino'],
            } as InfluxQueryInputParam
        }, [startOfDay.toISOString(), lastWeek.toISOString(), lastMonth.toISOString()]);

        const query = `data = from(bucket: "Home")
                          |> range(start: ${lastMonth.toISOString()}, stop: ${to})
                          |> filter(fn: (r) => r["_measurement"] == "Arduino")

                        getSubSectionAggregation = (table=<-, currentStart) => table
                          |> range(start: currentStart)
                          |> mean()
                          |> map(fn: (r) => ({r with _time: r["_start"]}))

                        var0 = data
                          |> getSubSectionAggregation(currentStart: ${startOfDay.toISOString()})

                        var1 = data
                          |> getSubSectionAggregation(currentStart: ${lastWeek.toISOString()})

                        var2 = data
                          |> getSubSectionAggregation(currentStart: ${lastMonth.toISOString()})

                        union(tables: [var0, var1, var2])
                          |> drop(columns: ["_start", "_stop", "host"])
                          |> pivot(columnKey: ["_field"], rowKey: ["_measurement", "_time"], valueColumn: "_value")
                          |> rename(columns: {_time: "time", _measurement: "sensor"})
                          |> group(columns: ["measurement"], mode: "by")
                        `;

        expect(queryApi.collectRows).toBeCalledTimes(1);
        expect(queryApi.collectRows.mock.calls[0][0].replace(/\s/g, '')).toEqual(query.replace(/\s/g, ''));
    });

});

describe('Test filterDistinctValue generation', () => {
    it('Test simple string query', async () => {
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const lastWeek = new Date(startOfDay.getTime() - 7 * 24 * 60 * 60 * 1000);
        const to = new Date();
        const influx = new Influx('http://localhost:8086', 'test', 'test', 'test');
        const input = {
            operation: '' as Operation,
            bucket: 'default',
            param: {
                from: lastWeek.toISOString(),
                to: to.toISOString(),
                sensors: {id: ['value']}
            }
        };
        await influx.filterDistinctValue(input, true, true, ['open', 'closed']);

        const query = `import "strings"
                        endFilter = (table=<-) => table
                          |> duplicate(column: "level_value", as: "diff")
                          |> difference(columns: ["diff"])
                          |> filter(fn: (r) => r.diff != 0)
                          |> drop(columns: ["diff", "level_value"])

                        distincts = (table=<-) =>
                          table
                            |> map(
                              fn: (r) => ({r with level_value:
                                  if r._value == open then 0
                                  else if r._value == closed then 1
                                  else -1,
                              }),
                            )
                            |> endFilter()

                        from(bucket: "default")
                            |> range(start: ${lastWeek.toISOString()}, stop: ${to.toISOString()})
                            |> filter(fn: (r) => (r["_measurement"] == "id" and (r["_field"] == "value")))
                            |> distincts()
                            |> count()
                            |> set(key: "_time", value: "${to.toISOString()}")
                            |> drop(columns: ["_start", "_stop", "host"])
                            |> pivot(columnKey: ["_field"], rowKey: ["_measurement", "_time"], valueColumn: "_value")
                            |> rename(columns: {_time: "time", _measurement: "sensor"})
                            |> group(columns: ["measurement"], mode: "by")
                        `;

        expect(queryApi.collectRows).toBeCalledTimes(1);
        expect(queryApi.collectRows.mock.calls[0][0].replace(/\s/g, '')).toEqual(query.replace(/\s/g, ''));
    });
    it('Test simple string providing only one value', async () => {
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const lastWeek = new Date(startOfDay.getTime() - 7 * 24 * 60 * 60 * 1000);
        const to = new Date();
        const influx = new Influx('http://localhost:8086', 'test', 'test', 'test');
        const input = {
            operation: '' as Operation,
            bucket: 'default',
            param: {
                from: lastWeek.toISOString(),
                to: to.toISOString(),
                sensors: {id: ['value']}
            }
        };
        await influx.filterDistinctValue(input, true, false, ['open']);

        const query = `import "strings"
                        endFilter = (table=<-) => table
                          |> duplicate(column: "level_value", as: "diff")
                          |> difference(columns: ["diff"])
                          |> filter(fn: (r) => r.diff != 0)
                          |> drop(columns: ["diff", "level_value"])

                        distincts = (table=<-) =>
                          table
                            |> map(
                              fn: (r) => ({r with level_value:
                                  if r._value == open then 0
                                  else -1,
                              }),
                            )
                            |> endFilter()

                        from(bucket: "default")
                            |> range(start: ${lastWeek.toISOString()}, stop: ${to.toISOString()})
                            |> filter(fn: (r) => (r["_measurement"] == "id" and (r["_field"] == "value")))
                            |> distincts()
                            |> drop(columns: ["_start", "_stop", "host"])
                            |> pivot(columnKey: ["_field"], rowKey: ["_measurement", "_time"], valueColumn: "_value")
                            |> rename(columns: {_time: "time", _measurement: "sensor"})
                            |> group(columns: ["measurement"], mode: "by")
                        `;

        expect(queryApi.collectRows).toBeCalledTimes(1);
        expect(queryApi.collectRows.mock.calls[0][0].replace(/\s/g, '')).toEqual(query.replace(/\s/g, ''));
    });
    it('Test simple float', async () => {
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const lastWeek = new Date(startOfDay.getTime() - 7 * 24 * 60 * 60 * 1000);
        const to = new Date();
        const influx = new Influx('http://localhost:8086', 'test', 'test', 'test');
        const input = {
            operation: '' as Operation,
            bucket: 'Home',
            param: {
                from: lastWeek.toISOString(),
                to: to.toISOString(),
                sensors: {Arduino: ['light']}
            }
        };
        await influx.filterDistinctValue(input, false, false, [0]);

        const query = `import "strings"
                        endFilter = (table=<-) => table
                          |> duplicate(column: "level_value", as: "diff")
                          |> difference(columns: ["diff"])
                          |> filter(fn: (r) => r.diff != 0)
                          |> drop(columns: ["diff", "level_value"])

                        distincts = (table=<-) =>
                            table
                                |> map(
                                  fn: (r) => ({r with level_value:
                                      if r._value == 0 then 0
                                      else -1,
                                  }),)
                                |> endFilter()

                        from(bucket: "Home")
                            |> range(start: ${lastWeek.toISOString()}, stop: ${to.toISOString()})
                            |> filter(fn: (r) => (r["_measurement"] == "Arduino" and (r["_field"] == "light")))
                            |> distincts()
                            |> drop(columns: ["_start", "_stop", "host"])
                            |> pivot(columnKey: ["_field"], rowKey: ["_measurement", "_time"], valueColumn: "_value")
                            |> rename(columns: {_time: "time", _measurement: "sensor"})
                            |> group(columns: ["measurement"], mode: "by")
                        `;

        expect(queryApi.collectRows).toBeCalledTimes(1);
        expect(queryApi.collectRows.mock.calls[0][0].replace(/\s/g, '')).toEqual(query.replace(/\s/g, ''));
    });
});
