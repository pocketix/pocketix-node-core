import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ParameterValue} from "./ParameterValue";

@Entity()
class ParameterType {
    /**
     * Type identifier
     */
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * Type name
     */
    @Column()
    name: string;

    /**
     * Type human friendly name
     */
    @Column()
    label: string;

    /**
     * Type measured in units
     */
    @Column({default: "°C"})
    units: string;

    /**
     * First (minimum) threshold
     */
    @Column({type: "float"})
    threshold1?: number;

    /**
     * Second (maximum) threshold
     */
    @Column({type: "float"})
    threshold2?: number;

    /**
     * Type name
     */
    @Column()
    type: string;

    /**
     * Type range minimum
     */
    @Column({type: "float", default: 0})
    min: number;

    /**
     * Type range maximum
     */
    @Column({type: "float", default: 0})
    max: number;

    /**
     * Values of current type
     */
    @OneToMany(() => ParameterValue,
        (parameterValue) => parameterValue.type,
        {cascade: true, eager: false}
    )
    values: ParameterValue[];
}

export {ParameterType};
