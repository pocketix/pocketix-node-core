import {NextApiRequest, NextApiResponse} from "next";
import {connect, selectAll} from "../../../lib/Surreal";
import {ConcreteDevice, DeviceType} from '../../../lib/types';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const surreal = await connect();
    const devices = await selectAll(surreal) as DeviceType[];
    let concreteDevices = await selectAll(surreal, "concreteDevices") as ConcreteDevice[];

    devices.forEach(device => {
        let concreteDevicesForCurrentDevice = concreteDevices.filter(item => item?.abstractDeviceId === device.id);
        concreteDevices = concreteDevices.filter(item => !concreteDevicesForCurrentDevice.includes(item));

        const difference = concreteDevicesForCurrentDevice.length - device.deviceCount;
        console.log(difference);

        if (difference < 0) {
            const length = difference * -1;
            // @ts-ignore
            concreteDevicesForCurrentDevice.push(...[...Array(length).keys()].map(_ => {return {
                abstractDeviceId: device.id || "",
                deviceUid: "concreteDevices:" + Math.random().toString(36).substring(2, 10),
                // FIXME parameter value should be random based on the type
                deviceValues: Object.fromEntries(device.parameters.map(parameter => [parameter.id, parameter.value ?? 42]))
            }}));
        }

        if (difference > 0) {
            concreteDevicesForCurrentDevice = concreteDevicesForCurrentDevice.slice(concreteDevicesForCurrentDevice.length - difference);
        }

        concreteDevices.push(...concreteDevicesForCurrentDevice);
    });


    res.status(200).json(concreteDevices);
}

export default handler;
