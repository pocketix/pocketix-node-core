/* tslint:disable */
/* eslint-disable */
import { Device } from './device';
import { ParameterType } from './parameter-type';
export interface ParameterValue {
  device: Device;
  id: number;
  number?: number;
  string?: string;
  type: ParameterType;
  visibility: number;
}
