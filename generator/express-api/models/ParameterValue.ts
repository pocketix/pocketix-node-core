/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Device } from './Device';
import type { ParameterType } from './ParameterType';

export type ParameterValue = {
    /**
     * Parameter Value identifier
     */
    id: number;
    /**
     * Numerical value if exists
     */
    number?: number;
    /**
     * String value if exists
     */
    string?: string;
    /**
     * Visibility class
     */
    visibility: number;
    /**
     * Type of current parameter
     */
    type: ParameterType;
    /**
     * Device associated with this device
     */
    device: Device;
};
