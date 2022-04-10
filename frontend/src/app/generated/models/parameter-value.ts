/* tslint:disable */
/* eslint-disable */
import { Device } from './device';
import { ParameterType } from './parameter-type';
export interface ParameterValue {

  /**
   * Device associated with this device
   */
  device: Device;

  /**
   * Parameter Value identifier
   */
  id: number;

  /**
   * Numerical value if exists
   */
  number?: number;

  /**
   * String value if exists
   */
  string?: string;

  /**
   * Type of current parameter
   */
  type: ParameterType;

  /**
   * Visibility class
   */
  visibility: number;
}
