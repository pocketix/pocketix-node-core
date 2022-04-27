import {Service} from "typedi";
import {Device} from "../../model/Device";

@Service()
class DeviceService {
    public async upsertDevice(device: Device) {

    }

    public async getDevice(deviceUid: string): Promise<Device> {
        return {} as unknown as Device;
    }

    public async getAllDevices(): Promise<Device[]> {
        return [{}] as unknown as Device[];
    }

    public async getDevicesByDeviceType(type?: string): Promise<Device[]> {
        return [{}] as unknown as Device[];
    }
}

export {DeviceService};
