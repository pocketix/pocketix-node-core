import {Device} from "../../../generated/models/device";
import {ApexAxisChartSeries} from "ng-apexcharts";
import {DataItem} from "@swimlane/ngx-charts/lib/models/chart-data.model";

type Bullet = {
  value: number;
  max: number;
  min: number;
  previousValue: number;
  thresholds: number[];
  units: string;
  name: string;
};

type BulletsState = {
  data: Bullet[];
  device: Device;
};

type BoxState = {
  name: string,
  data: ApexAxisChartSeries
}[];

type SparklineState = {
  device: Device,
  data: any[],
  minMax: {[p: string]: DataItem[] }
};

type BoxMetadata = {
  name: string,
  data: ApexAxisChartSeries
}[];

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
