type DeviceParameterType = "number" | "string" | "enum";

type DeviceParameter = {
    id?: number;
    name: string;
    type: DeviceParameterType;
    value?: string | number;
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

export type {
    DeviceParameter,
    DeviceType,
    DeviceParameterType
}
