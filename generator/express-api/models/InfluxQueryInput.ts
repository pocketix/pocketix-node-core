/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { InfluxQueryInputParam } from './InfluxQueryInputParam';
import type { Operation } from './Operation';

/**
 * Input data to influx
 */
export type InfluxQueryInput = {
    /**
     * Operation to execute
     */
    operation: Operation;
    /**
     * Bucket to query from
     */
    bucket: string;
    /**
     * Data to query by
     */
    param: InfluxQueryInputParam;
};
