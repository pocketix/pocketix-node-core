/* tslint:disable */
/* eslint-disable */
import { DeviceType } from './device-type';
import { ParameterValue } from './parameter-value';
export interface Device {

  /**
   * Human friendly device description
   */
  description: string;

  /**
   * Human friendly device name
   */
  deviceName: string;

  /**
   * Device identifier or serial number
   */
  deviceUid: string;

  /**
   * Device image
   */
  image?: string;

  /**
   * Device Last seen at
   */
  lastSeenDate: string;

  /**
   * Device latitude coordinate
   */
  latitude: number;

  /**
   * Device longitude coordinate
   */
  longitude: number;

  /**
   * Last device parameter values
   */
  parameterValues?: Array<ParameterValue>;

  /**
   * Device registered at
   */
  registrationDate: string;

  /**
   * Device type
   */
  type: DeviceType;
}
