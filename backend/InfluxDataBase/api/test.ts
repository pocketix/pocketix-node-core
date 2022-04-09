import {Influx} from './Influx';
import {
    InfluxQueryInput,
    InfluxQueryInputParam,
    InputData,
    Sensors,
    SensorsWithFields
} from './influxTypes';


const url = 'http://localhost:8086';
const org = 'my-org';
const token = '0srXHadc_qKZLnLP7396XeeFx6Fi2jUleVx4yrTZhU2MhCMaA-7RUjbR5Smtrupffy3AbBH9g1Ot6X1o_ZGeAA==';
const bucket = 'temp';

(async () => {
    const influx = new Influx(url, org, token, bucket);
    await influx.query({BE7A020000000578: ['humidity']});
    await influx.query(['BE7A020000000578', '8CF9574000003214']);

    await influx.query(['BE7A020000000578'], '2021-10-10T23:00:00.000Z', '2021-10-19T08:00:00.000Z');
    await influx.query(['BE7A020000000578', '8CF9574000003214'], '2021-10-10T23:00:00.000Z', '2021-10-19T08:00:00.000Z');

    await influx.query(['BE7A020000000578'], '2021-10-10T23:00:00.000Z', '2021-10-19T08:00:00.000Z', 20);
    console.log(await influx.query(['BE7A020000000578', '8CF9574000003214'], '2021-10-10T23:00:00.000Z', '2021-10-19T08:00:00.000Z', 30));

    let data = {
        deviceUid: 'BE7A020000000578',
        distance_cm: '-65',
        deviceType: 'waterLevel',
        battery: '3.4',
        tst: new Date(Date.now())
    };
    await influx.saveData([data] as InputData[]);

    data = {
        deviceUid: 'BE7A020000000578',
        distance_cm: '-65',
        deviceType: 'waterLevel',
        battery: '3.4',
        tst: new Date(Date.now())
    };

    data.tst = new Date(Date.now());
    await influx.saveOne(data as InputData);
    await influx.saveOne(data as InputData, 'bucketThatShouldNotExist');
    console.log(await influx.query({BE7A020000000578: ['distance_cm']}));

    console.log(await influx.queryApi({
        bucket: 'temp',
        operation: '',
        param: {sensors: (['BE7A020000000578'] as Sensors)} as InfluxQueryInputParam
    }));

    console.log('saving strings');
    const dataWithString = {
        deviceUid: 'BE7A020000000578',
        tst: new Date(Date.now()),
        stringValue: 'some string',
        deviceType: 'waterLevel'
    };
    const dataWithObject = {
        deviceUid: 'BE7A020000000578',
        tst: new Date(Date.now()),
        stringValueThatIsObject: {abc: 'abcd'},
        deviceType: 'waterLevel'
    };

    await influx.saveOne(dataWithString, 'temp');
    await influx.saveOne(dataWithObject, 'temp');

    console.log(await influx.queryApi({
        bucket: 'temp',
        operation: '',
        param: {
            sensors: ({BE7A020000000578: ['distance_cm', 'battery']} as SensorsWithFields),
            aggregateMinutes: 20
        } as InfluxQueryInputParam
    }));

    const dataWithNan = {
        deviceUid: 'BE7A020000000579',
        distance_cm: NaN,
        deviceType: 'waterLevel',
        battery: '3.4',
        tst: new Date(Date.now())
    };

    const dataWithBool = {
        deviceUid: 'BE7A020000000579',
        boolField: true,
        deviceType: 'waterLevel',
        battery: '3.4',
        tst: new Date(Date.now())
    };

    await influx.saveOne(dataWithNan, 'temp');
    await influx.saveOne(dataWithBool, 'temp');

    const queryData = {
        bucket: 'temp',
        operation: 'mean',
        param: {
            sensors: ({BE7A020000000578: ['distance_cm']} as SensorsWithFields),
            aggregateMinutes: 20
        }
    } as InfluxQueryInput;

    console.log(await influx.queryApi(queryData));
    queryData.operation = 'sum';
    console.log(await influx.queryApi(queryData));

    const now = new Date();
    const yesterday = new Date(now.setHours(now.getHours() - 24));
    const lateToday = new Date(yesterday.setHours(23, 59, 59, 999));
    const earlyToday = new Date(yesterday.setHours(0, 0, 0, 0));

    const BE7A02_1 = {
        deviceUid: 'BE7A02',
        value: 20,
        secondValue: 30,
        tst: earlyToday
    } as InputData;

    const BE7A02_2 = {
        deviceUid: 'BE7A02',
        value: 20,
        secondValue: 30,
        tst: lateToday
    } as InputData;

    await influx.saveData([BE7A02_1, BE7A02_2], 'temp_2');
    // Should return two records. This is because UTC is used and this splits
    console.log(await influx.queryApi({
        bucket: 'temp_2',
        operation: 'sum',
        param: {
            sensors: (['BE7A02'] as Sensors),
            aggregateMinutes: 1440,
            to: lateToday.toISOString(),
            from: earlyToday.toISOString()
        }
    } as InfluxQueryInput));

    // Should return only one result, correctly aggregated with the timezone in mind
    console.log(await influx.queryApi({
        bucket: 'temp_2',
        operation: 'sum',
        param: {
            sensors: ({BE7A02: ['value']} as Sensors),
            aggregateMinutes: 1440,
            to: lateToday.toISOString(),
            from: earlyToday.toISOString(),
            timezone: 'Europe/Prague'
        }
    }));

    BE7A02_1.deviceUid = 'BE7A03';
    BE7A02_2.deviceUid = 'BE7A03';
    await influx.saveData([BE7A02_1, BE7A02_2], 'temp_2');

    // BE7A03 should not be returned
    console.log(await influx.queryApi({
        bucket: 'temp_2',
        operation: 'sum',
        param: {
            sensors: ({BE7A02: ['value', 'secondValue']} as Sensors),
            aggregateMinutes: 1440,
            to: lateToday.toISOString(),
            from: earlyToday.toISOString(),
            timezone: 'Europe/Prague'
        }
    }));
})();
