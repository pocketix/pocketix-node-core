import {ParameterValue} from "./ParameterValue";
import {Column, Entity, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import {DeviceType} from "./DeviceType";

@Entity()
class Device {
    /**
     * Device identifier or serial number
     */
    @PrimaryColumn()
    deviceUid: string;

    /**
     * Human friendly device name
     */
    @Column()
    deviceName: string;

    /**
     * Device image
     */
    @Column()
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
    @Column()
    registrationDate: Date;

    /**
     * Human friendly device description
     */
    @Column()
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
}

export {Device};
