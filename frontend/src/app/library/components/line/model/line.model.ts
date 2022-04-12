import {MultiSeries} from "@swimlane/ngx-charts";
import {Device} from "../../../../generated/models/device";
import {Operation} from "../../../../generated/models/operation";

interface LineState {
  allKpis: { [key: string]: string }[];
  selectedKpis: { [key: string]: string }[];
  dates: Date[];
  allAggregationOperations: Operation[];
  selectedAggregationOperation: Operation;
  allDevices: DeviceOptions[];
  selectedDevicesToCompareWith: DeviceOptions[];
  results: MultiSeries;
  device: Device;
}

type DeviceOptions = {
  name: string,
  id: string
}

export {LineState};
