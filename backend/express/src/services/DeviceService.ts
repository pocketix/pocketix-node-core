import {DataSource} from "typeorm";
import {Container, Service} from "typedi";
import {Device} from "../model/Device";
import {InputData,} from '../../../InfluxDataBase/api/influxTypes';
import {ParameterValue} from "../model/ParameterValue";
import {ParameterType} from "../model/ParameterType";
import {DeviceType} from "../model/DeviceType";

@Service()
class DeviceService {
    private dataSource: DataSource;

    constructor() {
        this.dataSource = Container.get(DataSource);
    }

    public async upsertDevice(device: Device) {
        await this.dataSource.manager.save(device);
    }

    public async getDevice(deviceUid: string): Promise<Device> {
        const device = await this.getDeviceBase(deviceUid);

        if (device === null) {
            throw Error('not found');
        }

        return device as Device;
    }

    private async getDeviceBase(deviceUid: string) {
        return await this.dataSource.getRepository(Device).findOne({
            where: {
                deviceUid
            },
            relations: {
                parameterValues: true,
                capabilities: true,
            }
        });
    }

    public async getAllDevices(): Promise<Device[]> {
        return await this.dataSource.getRepository(Device)
            .createQueryBuilder("device")
            .innerJoinAndSelect("device.type", "device_type")
            .orderBy("device_type.id", "ASC")
            .getMany() ?? [];
    }

    public async getDevicesByDeviceType(type?: string): Promise<Device[]> {
        return await this.dataSource.getRepository(Device)
            .createQueryBuilder("device")
            .innerJoinAndSelect("device.type", "device_type")
            .where("device_type.name = :type", {type})
            .orderBy("device_type.id", "ASC")
            .getMany() ?? [];
    }

    public async updateDeviceIfExists(input: InputData): Promise<void> {
        try {
            const id = input.deviceUid;
            delete input.tst;
            delete input.deviceUid;

            let device = await this.getDeviceBase(id);
            console.log("deviceUid", id);
            if (!device) {
                // Create a new device if it doesn't exist
                device = this.dataSource.getRepository(Device).create();
                device.deviceUid = id;
                device.parameterValues = [];
                device.deviceName = id;
                device.image = "";
                device.latitude = 0;
                device.longitude = 0;
                device.lastSeenDate = new Date();
                device.registrationDate = new Date();
                device.description = "";
                // @ts-ignore
                device.typeId = 1;
                device.type = await this.dataSource.getRepository(DeviceType).findOneBy({id: 1});
                await this.dataSource.getRepository(Device).save(device);
                console.log("SHOULD CREATE DEVICE");
                // Set other properties from the input if needed
            }

            // Loop through each item in input
            for (const [key, value] of Object.entries(input)) {
                let parameter = device?.parameterValues?.find(item => item.type.name === key);
                if (!parameter) {
                    parameter = await this.createParameter(value, key, device);
                    device.parameterValues.push(parameter);
                }

                parameter[typeof value] = value;
            }

            // Save the device and parameters to the database
            await this.dataSource.getRepository(Device).save(device);
        } catch (e) {
            console.log(e);
        }
    }

    private async createParameter(value: any, key: string, device: Device) {
        // Determine the JavaScript type of the value
        const jsType = typeof value;

        // Retrieve or create the corresponding type in the database
        let parameterType = await this.dataSource.getRepository(ParameterType).findOneBy({name: key});
        if (!parameterType) {
            // Create a new parameter type if it doesn't exist
            parameterType = new ParameterType();
            parameterType.type = jsType;
            parameterType.name = key;
            parameterType.label = key;
            parameterType.min = -100;
            parameterType.max = 100;
            parameterType.units = "";
            parameterType.measurementsPerMinute = 1;
            parameterType.threshold1 = -10;
            parameterType.threshold2 = 10;

            await this.dataSource.getRepository(ParameterType).save(parameterType);
            // Set other properties for the parameter type if needed
        }

        // Create a new parameter for the device
        const parameter = this.dataSource.getRepository(ParameterValue).create();
        parameter.device = device;
        parameter.type = parameterType;
        parameter.visibility = jsType === "number" ? 3 : 4;
        parameter[parameterType.type] = value;
        await this.dataSource.getRepository(ParameterValue).save(parameter);


        return parameter;
    }
}

export {DeviceService};
