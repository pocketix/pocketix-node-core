/* tslint:disable */
/* eslint-disable */
import { ParameterValue } from './parameter-value';
export interface ParameterType {
  id: number;
  label: string;
  max: number;
  min: number;
  name: string;
  threshold1?: number;
  threshold2?: number;
  type: string;
  units: string;
  values: Array<ParameterValue>;
}
