/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Sensors } from './Sensors';

/**
 * Interface representing the body of a read request
 */
export type ReadRequestBody = {
    /**
     * Bucket to read from
     */
    bucket: string;
    /**
     * Sensors to read
     */
    sensors: Sensors;
    /**
     * Timezone override
     */
    timezone?: string;
};
