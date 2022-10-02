/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DeviceType } from './DeviceType';
import type { ParameterValue } from './ParameterValue';

export type Device = {
    /**
     * Device identifier or serial number
     */
    deviceUid: string;
    /**
     * Human friendly device name
     */
    deviceName: string;
    /**
     * Device image
     */
    image?: string;
    /**
     * Device latitude coordinate
     */
    latitude: number;
    /**
     * Device longitude coordinate
     */
    longitude: number;
    /**
     * Device Last seen at
     */
    lastSeenDate: string;
    /**
     * Device registered at
     */
    registrationDate: string;
    /**
     * Human friendly device description
     */
    description: string;
    /**
     * Last device parameter values
     */
    parameterValues?: Array<ParameterValue>;
    /**
     * Device type
     */
    type: DeviceType;
};
