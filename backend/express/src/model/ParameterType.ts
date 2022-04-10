import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ParameterValue} from "./ParameterValue";

@Entity()
class ParameterType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    label: string;

    @Column({default: "°C"})
    units: string;

    @Column({type: "float"})
    threshold1?: number;

    @Column({type: "float"})
    threshold2?: number;

    @Column()
    type: string;

    @Column({type: "float", default: 0})
    min: number;

    @Column({type: "float", default: 0})
    max: number;

    @OneToMany(() => ParameterValue,
        (parameterValue) => parameterValue.type,
        {cascade: true, eager: false}
    )
    values: ParameterValue[];
}

export {ParameterType};
