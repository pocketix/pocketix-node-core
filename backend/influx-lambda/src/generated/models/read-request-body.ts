/* tslint:disable */
/* eslint-disable */
import { Sensors } from './sensors';

/**
 * Interface representing the body of a read request
 */
export interface ReadRequestBody {

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
