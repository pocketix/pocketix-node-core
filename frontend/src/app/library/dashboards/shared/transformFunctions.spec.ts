import {Device, Operation, ParameterValue} from "app/generated/models";
import {createStorage, minMaxSeries} from "./tranformFunctions";
import {LineState} from "../../components/line/model/line.model";
import {MultiSeries} from "@swimlane/ngx-charts";

const getMockDeviceType = () => ({devices: [], id: 1, name: "test"});

const getMockDevice = () => ({
  description: "",
  deviceName: "",
  deviceUid: "device",
  lastSeenDate: "",
  latitude: 0,
  longitude: 0,
  parameterValues: undefined,
  registrationDate: "",
  type: getMockDeviceType()
} as Device);

const getBaseParameterValue = () => ({
  device: getMockDevice(),
  id: 1,
  // @ts-ignore
  type: {
    id: 1,
    label: "test",
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
