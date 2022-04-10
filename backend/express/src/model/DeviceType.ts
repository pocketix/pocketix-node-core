import {Column, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Device} from "./Device";

class DeviceType {
    /**
     * ID of the type
     */
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * Devices with current type
     */
    @OneToMany(() => Device, (device => device.type), {eager: true})
    devices: Device[];

    /**
     * Name of the type
     */
    @Column()
    name: string;
}

export {DeviceType};
