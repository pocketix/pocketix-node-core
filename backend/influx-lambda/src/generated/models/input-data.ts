/* tslint:disable */
/* eslint-disable */

/**
 * Interface representing data to be stored in InfluxDB
 */
export interface InputData {

  /**
   * Timestamp, either as JavaScript Date object or as a number representing unix timestamp
   */
  tst: (number | string);

  [key: string]: (number | string) | any;
}
