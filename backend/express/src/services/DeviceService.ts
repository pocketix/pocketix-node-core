import {DataSource} from "typeorm";
import {Container, Service} from "typedi";
import {Device} from "../model/Device";

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
        return await this.dataSource.manager.find(Device);
    }

    public async getDevicesByDeviceType(type?: string): Promise<Device[]> {
        return await this.dataSource.getRepository(Device)
            .createQueryBuilder("device")
            .innerJoinAndSelect("device.type", "device_type")
            .where("device_type.name = :type", {type})
            .getMany() ?? [];
    }
}

export {DeviceService};
