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

    @Get('')
    public async getAllDevices(): Promise<Device[]> {
        return await this.deviceService.getAllDevices();
    }
}

export {DeviceController};
