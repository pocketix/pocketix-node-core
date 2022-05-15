import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ParameterValue} from "./ParameterValue";

@Entity()
class ParameterType {
    /**
     * Type identifier
     */
    @PrimaryGeneratedColumn({type: "int"})
    id: number;

    /**
     * Type name
     */
    @Column({type: "varchar", length: 255})
    name: string;

    /**
     * Type human friendly name
     */
    @Column()
    label: string;

    /**
     * Type measured in units
     */
    @Column({type: "varchar", length: 255, default: "°C"})
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
    @Column({type: "varchar", length: 255})
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
     * Count of measurements per minute
     */
    @Column({type: "float", default: 4})
    measurementsPerMinute: number;

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
