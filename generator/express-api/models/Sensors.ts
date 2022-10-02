/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SensorsWithFields } from './SensorsWithFields';
import type { SimpleSensors } from './SimpleSensors';

/**
 * Sensors to be queried
 */
export type Sensors = (SimpleSensors | SensorsWithFields);
