/* tslint:disable */
/* eslint-disable */
import { Device } from './device';
export interface DeviceType {

  /**
   * Devices with current type
   */
  devices: Array<Device>;

  /**
   * ID of the type
   */
  id: number;

  /**
   * Name of the type
   */
  name: string;
}
