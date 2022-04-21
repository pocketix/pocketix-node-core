/* tslint:disable */
/* eslint-disable */
import { SensorsWithFields } from './sensors-with-fields';
import { SimpleSensors } from './simple-sensors';

/**
 * Sensors to be queried
 */
export type Sensors = (SimpleSensors | SensorsWithFields);
