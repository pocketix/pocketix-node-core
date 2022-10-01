type DeviceParameterType = "number" | "string" | "enum";

type DeviceParameterValue = string | number;

type DeviceParameter = {
    id?: number;
    name: string;
    type: DeviceParameterType;
    value?: DeviceParameterValue;
}

type DeviceType = {
    id?: number;
    name: string;
    uid?: string;
    messagesPerMinute: number;
    delta: number;
    deviceCount: number;
    parameters: DeviceParameter[]
}

type ConcreteDevice = {
    deviceUid: string;
    abstractDevice: DeviceType;
    deviceValues: {[deviceId: string]: DeviceParameterValue};
}

export type {
    DeviceParameter,
    DeviceType,
    DeviceParameterType,
    DeviceParameterValue,
    ConcreteDevice
}
