import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Device } from "./Device";

@Entity()
class Group {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @ManyToMany(() => Device, device => device.groups)
    @JoinTable()
    devices: Device[];
}

export { Group };
