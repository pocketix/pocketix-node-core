import {NextApiRequest, NextApiResponse} from "next";
import {connect, selectAll} from "../../../lib/Surreal";
import {ConcreteDevice, DeviceParameter, DeviceType} from '../../../lib/types';
import Surreal from "surrealdb.js";
import {InfluxService, OpenAPI} from "../../../express-api";

const randomValueByTypeAndPossibleValues = (parameterType: DeviceParameter) => {
    switch (parameterType.type) {
        case "string":
            return (Math.random() + 1).toString(36).substring(7);
        case "number":
            return Math.random() * 100;
        case "enum":
            const possible = parameterType.value?.toString().split(';') || [];
            return possible[Math.floor(Math.random()* possible.length)];
    }
}

const getRandomDeviceValues = (device: DeviceType) =>
    Object.fromEntries(device.parameters.map(parameter => [parameter.id, randomValueByTypeAndPossibleValues(parameter)]));

const createMissingDevices = (count: number, device: DeviceType) => {
    // @ts-ignore
    return [...Array(count).keys()].map(_ => ({
        abstractDeviceId: device.id || "",
        deviceUid: undefined,
        // FIXME parameter value should be random based on the type
        deviceValues: getRandomDeviceValues(device)
    }));
};

const addMissingDevicesOrRemoveExcess = (devices: DeviceType[], concreteDevices: ConcreteDevice[]) => {
    let devicesToRemove: ConcreteDevice[] = [];
    devices.forEach(device => {
        let concreteDevicesForCurrentDevice = concreteDevices.filter(item => item?.abstractDeviceId === device.id);
        concreteDevices = concreteDevices.filter(item => !concreteDevicesForCurrentDevice.includes(item));

        const difference = concreteDevicesForCurrentDevice.length - device.deviceCount;

        if (difference < 0) {
            concreteDevicesForCurrentDevice.push(...createMissingDevices(difference * -1, device));
        }

        if (difference > 0) {
            devicesToRemove.push(...concreteDevicesForCurrentDevice.slice(concreteDevicesForCurrentDevice.length - difference));
            concreteDevicesForCurrentDevice = concreteDevicesForCurrentDevice.slice(0, concreteDevicesForCurrentDevice.length - difference);
        }

        concreteDevices.push(...concreteDevicesForCurrentDevice);
    });

    return {concreteDevices, devicesToRemove};
};

async function upsertConcreteDevices(concreteDevices: ConcreteDevice[], surreal: Surreal) {
    let index = 0;
    for (const device of concreteDevices) {
        if (device.deviceUid) {
            await surreal.update(device.deviceUid, device);
            continue;
        }

        const id = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
        concreteDevices[index] = await surreal.create("concreteDevices:" + id, {...device, deviceUid: id});
        index++;
    }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const surreal = await connect();
    const devices = await selectAll(surreal) as DeviceType[];
    let currentConcreteDevices = await selectAll(surreal, "concreteDevices") as ConcreteDevice[];

    const {concreteDevices, devicesToRemove} = addMissingDevicesOrRemoveExcess(devices, currentConcreteDevices);

    devicesToRemove.forEach(device => surreal.delete(device.deviceUid || ""));

    await upsertConcreteDevices(concreteDevices, surreal);

    OpenAPI.BASE = "http://localhost:3000";

    const promises = concreteDevices.map(async device => {
        const abstractDevice = devices.find(item => item.id === device.abstractDeviceId);
        const data = Object.fromEntries(abstractDevice?.parameters.map(parameter => [parameter.name, device.deviceValues[parameter.id || ""]]) || []);
        console.log(data);
        return InfluxService.saveData({
            bucket: "speedTest", data: [
                {
                    ...data,
                    tst: (new Date()).toISOString(),
                    deviceUid: device.deviceUid
                }
            ]
        });
    });

    await Promise.all(promises);

    res.status(200).json(concreteDevices);
}

export default handler;
