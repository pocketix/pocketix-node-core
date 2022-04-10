import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ParameterType} from "./ParameterType";
import {Device} from "./Device";

@Entity()
class ParameterValue {
    /**
     * Parameter Value identifier
     */
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * Numerical value if exists
     */
    @Column({type: "float", nullable: true})
    number?: number;

    /**
     * String value if exists
     */
    @Column({nullable: true})
    string?: string;

    /**
     * Visibility class
     */
    @Column({default: 3})
    visibility: number;

    /**
     * Type of current parameter
     */
    @ManyToOne(() => ParameterType,
        (parameterType) => parameterType.values,
        {eager: true}
    )
    type: ParameterType;

    /**
     * Device associated with this device
     */
    @ManyToOne(() => Device,
        (device) => device.parameterValues
    )
    device: Device;
}

export {ParameterValue};
