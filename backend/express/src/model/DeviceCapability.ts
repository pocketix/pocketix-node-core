import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Device } from "./Device";

enum CapabilityType {
    SCHEDULED = 'scheduled',
    SENT_TO_DEVICE = 'sent_to_device'
}

@Entity()
class DeviceCapability {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({
        type: "enum",
        enum: CapabilityType
    })
    type: CapabilityType;

    @Column({ type: "json", nullable: true })
    parameters: Array<CapabilityParameter>; // Additional parameters for the command

    @ManyToOne(() => Device, device => device.capabilities)
    device: Device;
}

type CapabilityParameter = {
    [key: string]: any
}

export { DeviceCapability, CapabilityType };
