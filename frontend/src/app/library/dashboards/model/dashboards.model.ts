import {Device} from "../../../generated/models/device";

type Bullet = {
  value: number;
  max: number;
  min: number;
  previousValue: number;
  thresholds: number[];
  units: string;
  name: string;
}

type BulletsState = {
  data: Bullet[];
  device: Device;
}

export {Bullet, BulletsState};
