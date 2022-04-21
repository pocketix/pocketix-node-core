/* tslint:disable */
/* eslint-disable */

/**
 * Interface representing single data point from InfluxDB
 */
export interface OutputData {

  /**
   * Result metadata, indicated what aggregate was used
   */
  result: string;

  /**
   * Sensor that the current sample belongs to
   */
  sensor: string;

  /**
   * Table number metadata
   */
  table: number;

  /**
   * Time of the current data sample
   */
  time: string;

  [key: string]: (number | string) | number | string;
}
