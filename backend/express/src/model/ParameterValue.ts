import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ParameterType} from "./ParameterType";
import {Device} from "./Device";

@Entity()
class ParameterValue {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "float", nullable: true})
    number?: number;

    @Column({nullable: true})
    string?: string;

    @Column({default: 3})
    visibility: number;

    @ManyToOne(() => ParameterType,
        (parameterType) => parameterType.values,
        {eager: true}
    )
    type: ParameterType;

    @ManyToOne(() => Device,
        (device) => device.parameterValues
    )
    device: Device;
}

export {ParameterValue};
