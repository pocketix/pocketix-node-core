/* tslint:disable */
/* eslint-disable */
import { InfluxQueryInputParam } from './influx-query-input-param';
import { Operation } from './operation';

/**
 * Input data to influx
 */
export interface InfluxQueryInput {

  /**
   * Bucket to query from
   */
  bucket: string;

  /**
   * Operation to execute
   */
  operation: Operation;

  /**
   * Data to query by
   */
  param: InfluxQueryInputParam;
}
