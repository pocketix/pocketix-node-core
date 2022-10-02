/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ParameterValue } from './ParameterValue';

export type ParameterType = {
    /**
     * Type identifier
     */
    id: number;
    /**
     * Type name
     */
    name: string;
    /**
     * Type human friendly name
     */
    label: string;
    /**
     * Type measured in units
     */
    units: string;
    /**
     * First (minimum) threshold
     */
    threshold1?: number;
    /**
     * Second (maximum) threshold
     */
    threshold2?: number;
    /**
     * Type name
     */
    type: string;
    /**
     * Type range minimum
     */
    min: number;
    /**
     * Type range maximum
     */
    max: number;
    /**
     * Count of measurements per minute
     */
    measurementsPerMinute: number;
    /**
     * Values of current type
     */
    values: Array<ParameterValue>;
};
