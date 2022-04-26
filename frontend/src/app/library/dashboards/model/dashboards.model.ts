import {Device} from "../../../generated/models/device";
import {ApexAxisChartSeries} from "ng-apexcharts";
import {DataItem} from "@swimlane/ngx-charts/lib/models/chart-data.model";

/**
 * Bullet data
 */
type Bullet = {
  value: number;
  max: number;
  min: number;
  previousValue: number;
  thresholds: number[];
  units: string;
  name: string;
};

/**
 * Current state of multiple bullets with the same device
 */
type BulletsState = {
  data: Bullet[];
  device: Device;
};

/**
 * Current box state wrapper
 */
type BoxState = {
  name: string,
  data: ApexAxisChartSeries
}[];

/**
 * Sparkline state, data should be compatible with the ngx-charts line
 * minMax can be used for all thresholds
 */
type SparklineState = {
  device: Device,
  data: any[],
  minMax: {[p: string]: DataItem[] }
};

type BoxMetadata = {
  name: string,
  data: ApexAxisChartSeries
}[];

/**
 * Helper type for converting data from Influx to ngx charts Series
 */
type Storage = {
  [sensor: string]: { [field: string]: DataItem[] }
};

export {
  Bullet,
  Storage,
  BoxState,
  BoxMetadata,
  BulletsState,
  SparklineState
};
