import {
    Command,
    ICommander,
    IReferenceManager,
    ReferencedValue,
    ReferencedValueItemsAsObject
} from "../../../ProgrammingLogimicPrototype";
import {Device} from "../model/Device";
import {DeviceService} from "./DeviceService";
import {Inject, Service} from "typedi";
import {JiapExpressReferencedValue} from "./JiapExpressReferencedValue";
import {CapabilityType} from "../model/DeviceCapability";

@Service()
class ReferenceManagerAndCommander implements ICommander, IReferenceManager {
    @Inject()
    private deviceService: DeviceService;
    private loadedDevices: Device[] = [];

    constructor(deviceService: DeviceService) {
        this.deviceService = deviceService;
    }

    async load(references: ReferencedValueItemsAsObject[]): Promise<ReferencedValue[]> {
        for (const reference of references) {
            await this.loadDeviceIfNotLoaded(reference.deviceId);
        }

        return references.map(reference => {
            const device = this.loadedDevices.find(loadedDevice => +loadedDevice.deviceUid === reference.deviceId);
            const parameter = device.parameterValues.find(parameterValue => parameterValue.type.name === reference.parameterName);

            return new JiapExpressReferencedValue(device.deviceUid, parameter);
        }) as any;
    }

    async sendCommands(dry: boolean, commands: Command[]): Promise<void> {
        for (const command of commands) {
            const device = await this.loadDeviceIfNotLoaded(command.deviceId);
            const commandToLaunch = device.capabilities.find(capability => capability.id === command.commandId);
            const commandValue = command.commandValue ?? command?.params !== undefined ? command.params[0] : undefined;

            commandToLaunch.parameters = [{"param": commandValue}];
            commandToLaunch.type = CapabilityType.SCHEDULED;

            if (dry) {
                return;
            }

            await this.deviceService.upsertDevice(device);
        }
    }

    async store(references: ReferencedValue[]): Promise<void> {
        await Promise.all(references.map(async item => {
            const device = this.loadedDevices.find(nestedDevice => nestedDevice.deviceUid === item.deviceId);

            device.parameterValues
                .find(parameter => parameter.type.name === item.parameterName)
                [item.type] = item.value;

            await this.deviceService.upsertDevice(device);
        }))
    }

    private async loadDeviceIfNotLoaded(deviceId: any) {
        let device = this.loadedDevices.find(currentDevice => currentDevice.deviceUid === deviceId);

        if (!device) {
            device = await this.deviceService.getDevice(deviceId);

            this.loadedDevices.push(device);
        }

        return device;
    }
}

export {ReferenceManagerAndCommander};
