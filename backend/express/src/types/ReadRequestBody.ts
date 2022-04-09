import {Sensors} from 'influx-aws-lambda/api/influxTypes';

/**
 * Interface representing the body of a read request
 */
interface ReadRequestBody {
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
}

export {ReadRequestBody};
