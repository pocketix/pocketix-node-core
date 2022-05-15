import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Device} from "./Device";

@Entity()
class DeviceType {
    /**
     * ID of the type
     */
    @PrimaryGeneratedColumn({type: "int"})
    id: number;

    /**
     * Devices with current type
     */
    @OneToMany(() => Device, (device => device.type))
    devices: Device[];

    /**
     * Name of the type
     */
    @Column({type: "varchar", length: 255})
    name: string;
}

export {DeviceType};
