import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Group } from "./Group";

enum Version {
    V1 = "v1",
    V2 = "v2"
}

@Entity()
class Program {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "jsonb" })
    data: any;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @ManyToOne(() => Group)
    @JoinColumn()
    group: Group;

    @Column({
        type: "enum",
        enum: Version,
        default: Version.V1
    })
    version: Version;

}

export {Program, Version};
