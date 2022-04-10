/* tslint:disable */
/* eslint-disable */
import { ParameterValue } from './parameter-value';
export interface Device {
  description: string;
  deviceName: string;
  deviceUid: string;
  image?: string;
  lastSeenDate: string;
  latitude: number;
  longitude: number;
  parameterValues?: Array<ParameterValue>;
  registrationDate: string;
}
