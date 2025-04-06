import {Service} from "typedi";
import {Device} from "../../model/Device";
import {InputData} from "../../../../influx-database/api/influxTypes";

@Service()
class DeviceService {
    public async upsertDevice(device: Device) {

    }

    public async getDevice(deviceUid: string): Promise<Device> {
        return {} as unknown as Device;
    }

    public async updateDeviceIfExists(input: InputData): Promise<void> {

    }

    public async getAllDevices(): Promise<Device[]> {
        return [{}] as unknown as Device[];
    }

    public async getDevicesByDeviceType(type?: string): Promise<Device[]> {
        return [{}] as unknown as Device[];
    }
}

export {DeviceService};
