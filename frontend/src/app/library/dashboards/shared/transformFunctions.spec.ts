import { Device, ParameterValue} from "app/generated/models";
import {minMaxSeries} from "./tranformFunctions";

describe('minMaxSeries', () => {
  let deviceType;
  let baseDevice: Device;
  let baseParameterValue: ParameterValue;

  beforeEach(() => {
    deviceType = {devices: [], id: 1, name: "test"};
    baseDevice = {
      description: "",
      deviceName: "",
      deviceUid: "",
      lastSeenDate: "",
      latitude: 0,
      longitude: 0,
      parameterValues: undefined,
      registrationDate: "",
      type: deviceType
    };
    baseParameterValue = {
      device: baseDevice,
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
    }
  })

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
})
