/* tslint:disable */
/* eslint-disable */
import { Sensors } from './sensors';

/**
 * Data used for querying the selected bucket
 */
export interface InfluxQueryInputParam {

  /**
   * Amount of minutes to aggregate by
   * For example if the queried range has 1 hour and aggregateMinutes is set to 10 the aggregation will result in 6 points
   */
  aggregateMinutes?: number;

  /**
   * Start of the querying window
   */
  from?: string;

  /**
   * Sensors to be queried
   */
  sensors: Sensors;

  /**
   * Timezone override default UTC.
   * For more details why and how this affects queries see: https://www.influxdata.com/blog/time-zones-in-flux/.
   * In most cases you can ignore this and some edge aggregations can be influenced.
   * If you need a precise result or the aggregation uses high amount of minutes provide the target time zone.
   */
  timezone?: string;

  /**
   * End of the querying window
   */
  to?: string;
}
