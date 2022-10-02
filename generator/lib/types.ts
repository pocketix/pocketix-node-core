type DeviceParameterType = "number" | "string" | "enum";

type DeviceParameterValue = string | number;

type DeviceParameter = {
    id?: string;
    name: string;
    type: DeviceParameterType;
    value?: DeviceParameterValue;
}

type DeviceType = {
    id?: string;
    name: string;
    uid?: string;
    messagesPerMinute: number;
    delta: number;
    deviceCount: number;
    parameters: DeviceParameter[]
}

type ConcreteDevice = {
    deviceUid?: string;
    abstractDeviceId: string;
    deviceValues: {[deviceId: string]: DeviceParameterValue};
}

export type {
    DeviceParameter,
    DeviceType,
    DeviceParameterType,
    DeviceParameterValue,
    ConcreteDevice
}
