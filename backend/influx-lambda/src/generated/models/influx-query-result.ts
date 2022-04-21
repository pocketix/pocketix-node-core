/* tslint:disable */
/* eslint-disable */
import { OutputData } from './output-data';

/**
 * Result from InfluxDB
 */
export interface InfluxQueryResult {

  /**
   * Array of OutputData
   */
  data: Array<OutputData>;

  /**
   * Error if any
   */
  error?: string;

  /**
   * Returned status
   */
  status: number;
}
