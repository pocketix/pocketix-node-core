/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OutputData } from './OutputData';

/**
 * Result from InfluxDB
 */
export type InfluxQueryResult = {
    /**
     * Returned status
     */
    status: number;
    /**
     * Error if any
     */
    error?: string;
    /**
     * Array of OutputData
     */
    data: Array<OutputData>;
};
