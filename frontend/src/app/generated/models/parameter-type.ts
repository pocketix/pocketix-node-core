/* tslint:disable */
/* eslint-disable */
import { ParameterValue } from './parameter-value';
export interface ParameterType {

  /**
   * Type identifier
   */
  id: number;

  /**
   * Type human friendly name
   */
  label: string;

  /**
   * Type range maximum
   */
  max: number;

  /**
   * Count of measurements per minute
   */
  measurementsPerMinute: number;

  /**
   * Type range minimum
   */
  min: number;

  /**
   * Type name
   */
  name: string;

  /**
   * First (minimum) threshold
   */
  threshold1?: number;

  /**
   * Second (maximum) threshold
   */
  threshold2?: number;

  /**
   * Type name
   */
  type: string;

  /**
   * Type measured in units
   */
  units: string;

  /**
   * Values of current type
   */
  values: Array<ParameterValue>;
}
