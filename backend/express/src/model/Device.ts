import {ParameterValue} from "./ParameterValue";
import {Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import {DeviceType} from "./DeviceType";
import {DeviceCapability} from "./DeviceCapability";
import {Group} from "./Group";

@Entity()
class Device {
    /**
     * Device identifier or serial number
     */
    @PrimaryColumn({type: "varchar", length: 255})
    deviceUid: string;

    /**
     * Human friendly device name
     */
    @Column({type: "varchar", length: 255})
    deviceName: string;

    /**
     * Device image
     */
    @Column({type: "varchar", length: 255})
    image?: string

    /**
     * Device latitude coordinate
     */
    @Column({type: "float"})
    latitude: number;

    /**
     * Device longitude coordinate
     */
    @Column({type: "float"})
    longitude: number;

    /**
     * Device Last seen at
     */
    @Column()
    lastSeenDate: Date;

    /**
     * Device registered at
     */
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    registrationDate: Date;

    /**
     * Human friendly device description
     */
    @Column({type: "varchar", length: 1024})
    description: string;

    /**
     * Last device parameter values
     */
    @OneToMany(() => ParameterValue,
        (parameterValue) => parameterValue.device,
        {cascade: true}
    )
    parameterValues?: ParameterValue[];

    /**
     * Device type
     */
    @ManyToOne(() => DeviceType, (deviceType) => deviceType.devices, {eager: true})
    type: DeviceType;

    @OneToMany(() => DeviceCapability, capability => capability.device, { cascade: true })
    capabilities?: DeviceCapability[];

    @ManyToMany(() => Group, group => group.devices)
    groups: Group[];
}

export {Device};
