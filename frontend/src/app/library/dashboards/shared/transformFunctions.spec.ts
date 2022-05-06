import {Device, Operation, ParameterValue} from "app/generated/models";
import {
  createMappingFromParameterValues,
  createNgxNameValuePair,
  createPastDaysSwitchDataTicks,
  createSensors,
  createStorage,
  extractDataFromDeviceDefinition,
  getDeviceName,
  getFieldByType,
  handleMultipleLines,
  handleOtherParam,
  itemsToBarChart,
  kpiParamToKpi,
  minMaxSeries,
  parameterValueToBullet,
  parseOtherParams,
  pushOrInsertArray,
  storageToSparklines,
  sumGroups,
  toBoxData,
  twoDatesAndPointCountToAggregationMinutes,
  updatePreviousValue
} from "./tranformFunctions";
import {LineState} from "../../components/line/model/line.model";
import {Bullet, BulletsState} from "../model/dashboards.model";
import {CurrentDayState, PastDaysState} from "../../components/categorical/model/categorical.model";

const getMockDeviceType = () => ({devices: [], id: 1, name: "test"});

const getMockDevice = () => ({
  description: "",
  deviceName: "",
  deviceUid: "device",
  lastSeenDate: "2022-05-01T11:41:11.139Z",
  latitude: 0,
  longitude: 0,
  parameterValues: undefined,
  registrationDate: "2022-05-01T11:41:11.139Z",
  type: getMockDeviceType()
} as Device);

const getBaseParameterValue = () => ({
  device: getMockDevice(),
  id: 1,
  // @ts-ignore
  type: {
    id: 1,
    label: "Test",
    min: 1,
    max: 2,
    measurementsPerMinute: 1,
    name: "test",
    type: "number",
    units: ""
  }
} as ParameterValue);

const getMockLineState = (device: Device) => ({
  allKpis: [{'first': 'first KPI'}, {'second': 'second KPI'}],
  selectedKpis: [{'first': 'first KPI'}],
  dates: [new Date(), new Date()],
  allAggregationOperations: [Operation.Sum],
  selectedAggregationOperation: Operation.Sum,
  allDevices: [],
  selectedDevicesToCompareWith: [],
  results: [],
  device
}) as LineState;

describe('minMaxSeries', () => {
  let baseDevice: Device;
  let baseParameterValue: ParameterValue;

  beforeEach(() => {
    baseDevice = getMockDevice();
    baseParameterValue = getBaseParameterValue();
  });

  it('should extract both series', () => {
    baseParameterValue.type.threshold1 = 1;
    baseParameterValue.type.threshold2 = 2;
      baseDevice.parameterValues = [{
        ...baseParameterValue,
      }
    ];
    expect(minMaxSeries(baseDevice, 'test')).toEqual(
      [{value: 1, name: "Minimum"}, {value: 2, name: "Maximum"}]
    );
  });

  it('should extract one series', () => {
    baseParameterValue.type.threshold1 = 1;
      baseDevice.parameterValues = [{
        ...baseParameterValue,
      }
    ];
    expect(minMaxSeries(baseDevice, 'test')).toEqual([{value: 1, name: "Threshold"}]);
  });
});

describe('createStorage', () => {
  let lineState: LineState;
  beforeEach(() => {
    lineState = getMockLineState(getMockDevice());
  });


  it('creates storage correctly', () => {
    const data = [
      {time: '2022-05-01T11:41:11.139Z', value: 1, sensor: 'device', result: '', table: 0},
      {time: '2022-05-01T12:41:11.139Z', value: 2, sensor: 'device', result: '', table: 0}
    ];

    const {storage} = createStorage(
      lineState, {status: 0, data}, ['value'], (name) => name
    );

    const expectedOutput = {device:
        {value: [
          {value: 1, name: new Date("2022-05-01T11:41:11.139Z")},
          {value: 2, name: new Date("2022-05-01T12:41:11.139Z")}
      ]}
    };
    expect(storage).toEqual(expectedOutput);
  });

  it('creates storage correctly with multiple values, one gets ignored', () => {
    const data = [
      {time: '2022-05-01T11:41:11.139Z', value: 1, value2: 1, sensor: 'device', result: '', table: 0},
      {time: '2022-05-01T12:41:11.139Z', value: 2, value2: 2, sensor: 'device', result: '', table: 0}
    ];

    const {storage} = createStorage(
      lineState, {status: 0, data}, ['value'], (name) => name
    );

    const expectedOutput = {device:
        {value: [
            {value: 1, name: new Date("2022-05-01T11:41:11.139Z")},
            {value: 2, name: new Date("2022-05-01T12:41:11.139Z")}
          ]}
    };
    expect(storage).toEqual(expectedOutput);
  });

  it('creates storage correctly with multiple values', () => {
    const data = [
      {time: '2022-05-01T11:41:11.139Z', value: 1, value2: 1, sensor: 'device', result: '', table: 0},
      {time: '2022-05-01T12:41:11.139Z', value: 2, value2: 2, sensor: 'device', result: '', table: 0}
    ];

    const {storage} = createStorage(
      lineState, {status: 0, data}, ['value', 'value2'], (name) => name
    );

    const expectedOutput = {device: {
        value: [
            {value: 1, name: new Date("2022-05-01T11:41:11.139Z")},
            {value: 2, name: new Date("2022-05-01T12:41:11.139Z")}
          ],
        value2: [
          {value: 1, name: new Date("2022-05-01T11:41:11.139Z")},
          {value: 2, name: new Date("2022-05-01T12:41:11.139Z")}
        ]
    }};

    expect(storage).toEqual(expectedOutput);
  });
});

describe('toBoxData', () => {
  it('computes correctly', () => {
    const data = [
      {value: 1, name: new Date("2022-05-01T11:41:11.139Z")},
      {value: 2, name: new Date("2022-05-01T11:41:11.139Z")},
      {value: 3, name: new Date("2022-05-01T11:41:11.139Z")}
    ];

    const boxData = toBoxData(data);
    expect(boxData).toEqual([0.0, 1.5, 2, 2.5, 3.0]);
  });
});

describe('getFieldByType', () => {
  it('selects number', () => {
    const parameter = {number: 1, type: {type: "number"}} as ParameterValue

    expect(getFieldByType(parameter)).toEqual(1);
  });

  it('selects string', () => {
    const parameter = {string: "a", type: {type: "string"}} as ParameterValue

    expect(getFieldByType(parameter)).toEqual("a");
  });

  it('return undefined field', () => {
    const parameter = {string: "a", type: {type: "asdaa"}} as ParameterValue

    expect(getFieldByType(parameter)).toEqual(undefined);
  });
})

describe('handleOtherParam', () => {
  it('converts to date', () => {
    expect(handleOtherParam("lastDate", 0, "label"))
      .toEqual([new Date(0).toLocaleString(), "label"]);
  });

  it('does not convert', () => {
    expect(handleOtherParam("lastZero", 0, "label")).toEqual([0, "label"]);
  });

  it('tries magic on label', () => {
    expect(handleOtherParam("lastZero", 0, "LastZero")).toEqual([0, "Last Zero"]);
  });
});

describe('parseOtherParams', () => {
  it('converts to date', () => {
    const parameter = {number: 0, type: {type: "number", name: "lastDate", label: "label"}} as ParameterValue

    expect(parseOtherParams(parameter))
      .toEqual([new Date(0).toLocaleString(), "label"]);
  });

  it('does not convert to date', () => {
    const parameter = {string: "a", type: {type: "string", name: "name", label: "label"}} as ParameterValue

    expect(parseOtherParams(parameter))
      .toEqual(["a", "label"]);
  });
});

describe('pushOrInsertArray', () => {
  it('inserts', () => {
    expect(pushOrInsertArray("key", {}, "value")).toEqual({key: ["value"]});
  });

  it('pushes', () => {
    expect(pushOrInsertArray("key", {key: ["value1"]}, "value2"))
      .toEqual({key: ["value1", "value2"]});
  });
});

describe('createSensors', () => {
  it('no other devices', () => {
    const device = getMockDevice();
    const value = getBaseParameterValue();
    const value2 = getBaseParameterValue();
    value.type.name = "temperature";
    value2.type.name = "humidity";

    device.parameterValues = [value, value2];
    const state = getMockLineState(device);
    const data = createSensors(state, ["temperature, humidity"]);
    expect(data).toEqual({"fields":["temperature, humidity"],"sensorIds":[],"sensors":{"device":["temperature, humidity"]}});
  });

  it('other devices, none selected', () => {
    const device = getMockDevice();
    const value = getBaseParameterValue();
    const value2 = getBaseParameterValue();

    value.type.name = "temperature";
    value2.type.name = "humidity";

    device.parameterValues = [value, value2];
    const state = getMockLineState(device);
    state.allDevices.push({name: "device2", id: "device2"});
    const data = createSensors(state, ["temperature, humidity"]);

    expect(data).toEqual({
      fields: ["temperature, humidity"],
      sensorIds:[],
      sensors: {
        device: ["temperature, humidity"]
      }
    });
  });

  it('other devices selected selected', () => {
    const device = getMockDevice();
    const device2Option = {name: "device2", id: "device2"};
    const value = getBaseParameterValue();
    const value2 = getBaseParameterValue();

    value.type.name = "temperature";
    value2.type.name = "humidity";

    device.parameterValues = [value, value2];
    const state = getMockLineState(device);
    state.allDevices.push(device2Option);
    state.selectedDevicesToCompareWith.push(device2Option);
    const data = createSensors(state, ["temperature, humidity"]);

    expect(data).toEqual({
      fields: ["temperature, humidity"],
      sensorIds:["device2"],
      sensors: {
        device: ["temperature, humidity"],
        device2: ["temperature, humidity"]
      }
    });
  });
});

describe('getDeviceName', () => {
  it('single device', () => {
    const device = getMockDevice();
    const state = getMockLineState(device);
    const name = getDeviceName(state, "temperature", device.deviceUid);

    expect(name).toEqual("temperature");
  });

  it('multiple devices', () => {
    const device = getMockDevice();
    const secondDeviceOption = {name: "second", id: "second"};
    device.deviceName = "Name"

    const state = getMockLineState(device);
    state.allDevices.push(secondDeviceOption);
    state.selectedDevicesToCompareWith.push(secondDeviceOption);
    const name = getDeviceName(state, "temperature", device.deviceUid);

    expect(name).toEqual("Name: temperature");
  });
});

describe('extractDataFromDeviceDefinition', () => {
  it('no additional data', () => {
    const device = getMockDevice();
    const data = extractDataFromDeviceDefinition(device);

    expect(data).toEqual([
      [device.deviceUid, 'Device Id'],
      [new Date(device.lastSeenDate).toLocaleString(), 'Last Seen'],
      [new Date(device.registrationDate).toLocaleString(), 'Registered At'],
      [device.latitude, "Latitude"],
      [device.longitude, "Longitude"]
    ]);
  });

  it('additional data but not other', () => {
    const device = getMockDevice();
    device.parameterValues = [
      getBaseParameterValue()
    ];

    device.parameterValues[0].visibility = 3;
    device.parameterValues[0].number = 3;

    const data = extractDataFromDeviceDefinition(device);

    expect(data).toEqual([
      [device.deviceUid, 'Device Id'],
      [new Date(device.lastSeenDate).toLocaleString(), 'Last Seen'],
      [new Date(device.registrationDate).toLocaleString(), 'Registered At'],
      [device.latitude, "Latitude"],
      [device.longitude, "Longitude"]
    ]);
  });

  it('additional data', () => {
    const device = getMockDevice();
    device.parameterValues = [{
      device,
      id: 0,
      visibility: 1,
      string: "data",
      type: {
        id: 1,
        label: "test",
        min: 0,
        max: 0,
        measurementsPerMinute: 0,
        name: "test",
        type: "string",
        units: "",
        values: []
      }
    }];

    const data = extractDataFromDeviceDefinition(device);

    expect(data).toEqual([
      ["data", "test"],
      [device.deviceUid, 'Device Id'],
      [new Date(device.lastSeenDate).toLocaleString(), 'Last Seen'],
      [new Date(device.registrationDate).toLocaleString(), 'Registered At'],
      [device.latitude, "Latitude"],
      [device.longitude, "Longitude"]
    ]);
  });
});

describe('updatePreviousValue', () => {
  it('no data from storage', () => {
    const device = getMockDevice();

    const storage = {
      device: {
        name: [
          {value: 1, name: new Date("2022-05-01T11:41:11.139Z")},
          {value: 2, name: new Date("2022-05-01T12:41:11.139Z")}
        ]}
    };

    const state = {
      device,
      data: [
        {
          value: 5,
          max: 10,
          min: 0,
          previousValue: 5,
          thresholds: [3, 7],
          units: "units",
          name: "name",
        } as Bullet
      ]
    } as BulletsState;

    const newState = {...state};
    updatePreviousValue(newState, storage);
    expect(newState).toEqual(state);
  });

  it('no data from storage', () => {
    const device = getMockDevice();

    const storage = {
      device: {
        name: [
          {value: 1, name: new Date("2022-05-01T11:41:11.139Z")},
          {value: 2, name: new Date("2022-05-01T12:41:11.139Z")}
        ]
      },
      device2: {
        name: [
          {value: 7, name: new Date("2022-05-01T11:41:11.139Z")},
          {value: 7, name: new Date("2022-05-01T12:41:11.139Z")}
        ]
      }
    };

    const state = {
      device,
      data: [
        {
          value: 5,
          max: 10,
          min: 0,
          previousValue: 3,
          thresholds: [3, 7],
          units: "units",
          name: "name",
        } as Bullet
      ]
    } as BulletsState;

    const newState = {...state, data: [{...state.data[0]}]};
    state.data[0].previousValue = 7;
    updatePreviousValue(newState, storage);
    expect(newState).toEqual(state);
  });
});

describe('handleMultipleLines', () => {
  it('has only single line', () => {
    const device = getMockDevice();
    const lineState = getMockLineState(device);
    const storage = {
      device: {
        name: [
          {value: 1, name: new Date("2022-05-01T11:41:11.139Z")},
          {value: 2, name: new Date("2022-05-01T12:41:11.139Z")}
        ]
      }
    };

    const lines = handleMultipleLines(lineState, [], storage);

    expect(lines).toEqual([{name: "name", series: storage.device.name}]);
  });

  it('has multiple devices', () => {
    const device = getMockDevice();
    const lineState = getMockLineState(device);
    const secondDevice = [{name: "device2", id: "device2"}];
    lineState.selectedDevicesToCompareWith = secondDevice;
    lineState.allDevices = secondDevice;

    const storage = {
      device: {
        name: [
          {value: 1, name: new Date("2022-05-01T11:41:11.139Z")},
          {value: 2, name: new Date("2022-05-01T12:41:11.139Z")}
        ]
      },
      device2: {
        name: [
          {value: 4, name: new Date("2022-05-01T11:41:11.139Z")},
          {value: 5, name: new Date("2022-05-01T12:41:11.139Z")}
        ]
      }
    };

    const lines = handleMultipleLines(lineState, ["device2"], storage);

    expect(lines).toEqual([
      {name: "device: name", series: storage.device.name},
      {name: "device2: name", series: storage.device2.name}
    ]);
  });
});

describe('storageToSparklines', () => {
  it('has only single line', () => {
    const device = getMockDevice();
    const lineState = getMockLineState(device);
    const storage = {
      device: {
        name: [
          {value: 1, name: new Date("2022-05-01T11:41:11.139Z")},
          {value: 2, name: new Date("2022-05-01T12:41:11.139Z")}
        ]
      }
    };

    const lines = storageToSparklines(lineState, storage);

    expect(lines).toEqual({"name": [{name: "name", series: storage.device.name}]});
  });

  it('has two lines', () => {
    const device = getMockDevice();
    const lineState = getMockLineState(device);
    const secondDevice = [{name: "device2", id: "device2"}];
    lineState.selectedDevicesToCompareWith = secondDevice;
    lineState.allDevices = secondDevice;

    const storage = {
      device: {
        name: [
          {value: 1, name: new Date("2022-05-01T11:41:11.139Z")},
          {value: 2, name: new Date("2022-05-01T12:41:11.139Z")}
        ]
      },
      device2: {
        name: [
          {value: 1, name: new Date("2022-05-01T11:41:11.139Z")},
          {value: 2, name: new Date("2022-05-01T12:41:11.139Z")}
        ]
      }
    };

    const lines = storageToSparklines(lineState, storage);

    expect(lines).toEqual({"name": [
          {name: "device: name", series: storage.device.name},
          {name: "device2: name", series: storage.device2.name}
        ]
    });
  });
});

describe('parameterValueToBullet', () => {
  it('tests the convertion', () => {
    const parameter = getBaseParameterValue();
    parameter.type.units = "units";

    const box = parameterValueToBullet(parameter);

    expect(box).toEqual({
      value: 0,
      min: 1,
      max: 2,
      previousValue: 0,
      thresholds: [0, 0],
      units: "units",
      name: "Test"
    });
  });
});

describe('createMappingFromParameterValues', () => {
  it('create from one parameter value', () => {
    const parameter = getBaseParameterValue();
    parameter.type.units = "units";

    const mapping = createMappingFromParameterValues([parameter]);

    expect(mapping(parameter.type.name)).toEqual("Test");
  });

  it('create from multiple parameter values', () => {
    const parameter = getBaseParameterValue();
    parameter.type.units = "units";

    const parameter2 = getBaseParameterValue();
    parameter2.type.units = "units";
    parameter2.type.name = "device2";
    parameter2.type.label = "Second Device Name";

    const mapping = createMappingFromParameterValues([parameter, parameter2]);

    expect(mapping(parameter.type.name)).toEqual("Test");
    expect(mapping(parameter2.type.name)).toEqual("Second Device Name");
  });

  it('create from multiple parameter values, one not in mapping, should fallback', () => {
    const parameter = getBaseParameterValue();
    parameter.type.units = "units";

    const parameter2 = getBaseParameterValue();
    parameter2.type.units = "units";
    parameter2.type.name = "device2";
    parameter2.type.label = "Second Device Name";

    const mapping = createMappingFromParameterValues([parameter]);

    expect(mapping(parameter.type.name)).toEqual("Test");
    expect(mapping(parameter2.type.name)).toEqual("device2");
  });
});

describe('twoDatesAndPointCountToAggregationMinutes', () => {
  it('should be day in minutes', () => {
    const start = new Date("2022-05-01T11:41:11.139Z");
    const stop = new Date("2022-05-02T11:41:11.139Z");

    const time = twoDatesAndPointCountToAggregationMinutes(start, stop, 1);

    expect(time).toBe(1440);
  });

  it('should be hour in minutes, reversed dates', () => {
    const start = new Date("2022-05-01T12:41:11.139Z");
    const stop = new Date("2022-05-01T11:41:11.139Z");

    const time = twoDatesAndPointCountToAggregationMinutes(start, stop, 1);

    expect(time).toBe(60);
  });

  it('should be 30 minutes', () => {
    const start = new Date("2022-05-01T11:41:11.139Z");
    const stop = new Date("2022-05-01T12:41:11.139Z");

    const time = twoDatesAndPointCountToAggregationMinutes(start, stop, 2);

    expect(time).toBe(30);
  });
});

describe('kpiParamToKpi', () => {
  it('Should find correctly', () => {
    const baseType = getBaseParameterValue().type;
    const types = [
      {...baseType, name: "first", label: "first label with longer string"},
      {...baseType, name: "second", label: "second label with longer string"}
    ];

    expect(kpiParamToKpi("first", types)).toBe("first label with longer string");
  });

  it('should fallback to name', () => {
    const baseType = getBaseParameterValue().type;
    const types = [
      {...baseType, name: "first", label: "first label with longer string"},
      {...baseType, name: "second", label: "second label with longer string"}
    ];

    expect(kpiParamToKpi("third", types)).toBe("third");
  });
});

describe('createPastDaysSwitchDataTicks', () => {
  it('Should find correctly', () => {
    const past = {
      startDate: new Date("2022-05-01T11:41:11.139Z"),
      endDate: new Date("2022-05-07T11:41:11.139Z")
    } as PastDaysState;

    createPastDaysSwitchDataTicks(past);

    expect(past.ticks).toEqual([
      new Date("2022-05-02T11:41:11.139Z").toDateString(),
      new Date("2022-05-03T11:41:11.139Z").toDateString(),
      new Date("2022-05-04T11:41:11.139Z").toDateString(),
      new Date("2022-05-05T11:41:11.139Z").toDateString(),
      new Date("2022-05-06T11:41:11.139Z").toDateString(),
      new Date("2022-05-07T11:41:11.139Z").toDateString(),
    ]);
  });
});

describe('createNgxNameValuePair', () => {
  it('Should create', () => {
    const baseType = getBaseParameterValue().type;
    const types = [
      {...baseType, name: "first", label: "first label with longer string"},
      {...baseType, name: "second", label: "second label with longer string"}
    ];
    const data = {time: '2022-05-01T11:41:11.139Z', first: 1, second: 2, sensor: 'device', result: '', table: 0};

    const output = createNgxNameValuePair(data, "first", types);

    expect(output).toEqual({name: "first label with longer string", value: 1});
  });
});

describe('itemsToBarChart', () => {
  it('Should create', () => {
    const baseType = getBaseParameterValue().type;
    const types = [
      {...baseType, name: "first", label: "first label with longer string"},
      {...baseType, name: "second", label: "second label with longer string"}
    ];
    const data = {
      status: 0,
      data: [
        {time: '2022-05-01T11:41:11.139Z', first: 1, second: 2, sensor: 'device', result: '', table: 0},
        {time: '2022-05-02T11:41:11.139Z', first: 1, second: 2, sensor: 'device', result: '', table: 0}
      ]
    };

    const output = itemsToBarChart(data, types, types, (date) => date);

    expect(output).toEqual([{
      name: "2022-05-01T11:41:11.139Z", series: [
        {name: "first label with longer string", value: 1},
        {name: "second label with longer string", value: 2}
      ]
    }, {
      name: "2022-05-02T11:41:11.139Z", series:[
        {name: "first label with longer string", value: 1},
        {name: "second label with longer string", value: 2}
      ]}
    ]);
  });
});

describe('sumGroups', () => {
  it('Should create', () => {
    const baseType = getBaseParameterValue().type;
    const types = [
      {...baseType, name: "first", label: "first label with longer string"},
      {...baseType, name: "second", label: "second label with longer string"}
    ];

    const data = {
      status: 0,
      data: [
        {time: '2022-05-01T11:41:11.139Z', first: 1, second: 2, sensor: 'device', result: '', table: 0},
        {time: '2022-05-02T11:41:11.139Z', first: 1, second: 2, sensor: 'device', result: '', table: 0}
      ]
    };

    const result = sumGroups(data, {fields: types} as CurrentDayState, types);
    expect(result).toEqual({"first label with longer string": 2,"second label with longer string": 4});
  });
});
