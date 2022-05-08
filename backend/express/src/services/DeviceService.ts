import {DataSource} from "typeorm";
import {Container, Service} from "typedi";
import {Device} from "../model/Device";
import {InputData,} from '../../../InfluxDataBase/api/influxTypes';
import {ParameterValue} from "../model/ParameterValue";


@Service()
class DeviceService {
    private dataSource: DataSource;

    constructor() {
        this.dataSource = Container.get(DataSource)
    }

    public async upsertDevice(device: Device) {
        await this.dataSource.manager.save(device);
    }

    public async getDevice(deviceUid: string): Promise<Device> {
        const device = await this.dataSource.getRepository(Device).findOne({
            where: {
                deviceUid: deviceUid
            },
            relations: {
                parameterValues: true
            }
        })

        if (device === null)
            throw Error('not found');

        return device as Device;
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

            const device = await this.dataSource.getRepository(Device).findOneBy({deviceUid: id});
            const parameters = await this.dataSource.getRepository(ParameterValue).findBy({device});
            parameters.forEach(
                parameter => parameter[parameter.type.type] = input[parameter.type.name] ?? parameter[parameter.type.type]
            );
            await this.dataSource.getRepository(ParameterValue).save(parameters);
        } catch (e) {
            console.log(e);
        }
    }
}

export {DeviceService};
