import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Device} from "./Device";

@Entity()
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
