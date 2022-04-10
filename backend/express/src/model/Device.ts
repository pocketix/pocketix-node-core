import {ParameterValue} from "./ParameterValue";
import {Column, Entity, OneToMany, PrimaryColumn} from "typeorm";

@Entity()
class Device {
    @PrimaryColumn()
    deviceUid: string;

    @Column()
    deviceName: string;

    @Column()
    image?: string

    @Column({type: "float"})
    latitude: number;

    @Column({type: "float"})
    longitude: number;

    @Column()
    lastSeenDate: Date;

    @Column()
    registrationDate: Date;

    @Column()
    description: string;

    @OneToMany(() => ParameterValue,
        (parameterValue) => parameterValue.device,
        {cascade: true}
    )
    parameterValues?: ParameterValue[];
}

export {Device};
