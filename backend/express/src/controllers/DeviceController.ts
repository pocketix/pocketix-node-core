import {DeviceService} from "../services/DeviceService";
import {Inject, Service} from "typedi";
import {Get, Path, Route, Tags} from "tsoa";
import {Device} from "../model/Device";

@Service()
@Tags("device")
@Route('devices')
class DeviceController {
    @Inject()
    private deviceService: DeviceService;

    constructor() {
    }

    /**
     * Get device by deviceUid
     * @param deviceUid deviceUid to search by
     */
    @Get('{deviceUid}')
    public async getDeviceById(@Path() deviceUid: string): Promise<Device> {
        return await this.deviceService.getDevice(deviceUid);
    }

    /**
     * Get all devices
     */
    @Get('')
    public async getAllDevices(): Promise<Device[]> {
        return await this.deviceService.getAllDevices();
    }

    /**
     * Get devices by specific type
     * @param deviceType type to filter by
     */
    @Get('byType/{deviceType}')
    public async getDevicesByDeviceType(@Path() deviceType: string) {
        return await this.deviceService.getDevicesByDeviceType(deviceType);
    }
}

export {DeviceController};
