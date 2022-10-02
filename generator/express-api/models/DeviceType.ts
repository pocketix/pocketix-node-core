/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Device } from './Device';

export type DeviceType = {
    /**
     * ID of the type
     */
    id: number;
    /**
     * Devices with current type
     */
    devices: Array<Device>;
    /**
     * Name of the type
     */
    name: string;
};
