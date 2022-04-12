import * as d3 from "d3";
import {ParameterValue} from "../../../generated/models/parameter-value";
import {Device} from "../../../generated/models/device";
import {LineState} from "../../components/line/model/line.model";
import {InfluxQueryResult} from "influx-aws-lambda/api/influxTypes";
import {DataItem} from "@swimlane/ngx-charts/lib/models/chart-data.model";
import {BulletsState} from "../model/dashboards.model";

const toBoxData = (series: any[]) => {
  const sortedSeries = series.map(item => item.value).sort();
  const q1 = +(d3.quantile(sortedSeries, .25) as number).toFixed(2);
  const median = +(d3.quantile(sortedSeries, .5) as number).toFixed(2);
  const q3 = +(d3.quantile(sortedSeries, .75) as number).toFixed(2);
  const interQuantileRange = q3 - q1;
  const min = q1 - 1.5 * interQuantileRange;
  const max = q1 + 1.5 * interQuantileRange;

  const data = [min.toFixed(2), q1, median, q3, max.toFixed(2)];

  return (max - min) < 0.5 ? undefined : data;
}

const parseOtherParams = (param: ParameterValue) => {
  let field = getFieldByType(param);
  return handleOtherParam(param.type.name, field, param.type.label);
}

const handleOtherParam = (name: string, field: any, label: string) => {
  if (name.toLowerCase().includes("date") && typeof field === "number") {
    field = new Date(field * 1000).toLocaleString();
  }

  return [field, label.split(/([A-Z][a-z]+)/).map((item: string) => item.trim()).filter((element: any) => element).join(' ')];
}

const getFieldByType = (param: ParameterValue) => {
  switch (param.type.type) {
    case "string":
      return param.string;
    case "number":
      return param.number;
  }
  return "";
}

type Storage = { [sensor: string]: { [field: string]: any[] } };

const createStorage = (lineState: LineState,
                       items: InfluxQueryResult,
                       fields: string[],
                       mapping: (name: string) => string): { thresholdLines: { [p: string]: DataItem[] }; storage: Storage} => {
  const storage = Object.fromEntries(
    [...lineState.selectedDevicesToCompareWith.map((device: { id: any; }) => device.id), lineState.device.deviceUid].map(key =>
      [key, Object.fromEntries(fields.map(field => [mapping(field), []]))]
    )
  );

  const thresholdLines = {} as {[field: string]: {value: number, name: string}[]};

  items.data.forEach((item: { [x: string]: any; sensor: string | number; time: string | number | Date; }) => {
    fields.forEach(field => {
      thresholdLines[mapping(field)] = minMaxSeries(lineState.device, field)
      storage[item.sensor][mapping(field)].push({value: Number(item[field]).toFixed(2), name: new Date(item.time)});
    })
  });
  return {storage, thresholdLines};
}

const pushOrInsertArray = (key: string, object: any, value: any) => {
  if (object[key])
    return object[key].push(value);
  else
    return object[key] = [value];
};

const minMaxSeries = (device: Device, field: string) => {
  const parameter = device?.parameterValues?.find(parameter => parameter?.type?.name === field);
  // sort the thresholds
  const thresholds = [parameter?.type?.threshold1 || 0, parameter?.type?.threshold2 || 0].sort();

  return thresholds[0] === thresholds[1] ?
    [{value: thresholds[0], name: "Threshold"}] : // Same thresholds clip label and don't look too good
    [{value: thresholds[0], name: "Minimum"}, {value: thresholds[1], name: "Maximum"}];
}

const createSensors = (device: Device, lineState: LineState, fields: string[]) => {
  const sensorIds = lineState.selectedDevicesToCompareWith.map(item => item.id);
  const sensors = Object.fromEntries(sensorIds.map(deviceUid => [deviceUid as string, fields]));
  sensors[device?.deviceUid as string] = fields;
  return {fields, sensorIds, sensors}
}

const extractDataFromDeviceDefinition = (device: Device) => {
  return [
    [device.deviceUid, "Device Id"],
    [device.deviceName, "Device Name"],
    [(new Date(device.lastSeenDate)).toLocaleString(), "Last seen"],
    [(new Date(device.registrationDate)).toLocaleString(), "Registered at"],
    [device.latitude, "Latitude"],
    [device.longitude, "Longitude"]
  ]
}

const updatePreviousValue = (bulletsState: BulletsState, storage: { [sensor: string]: { [field: string]: any[]; }; }) => {
  const data = Object.entries(storage).filter(([key, _]) => key !== bulletsState.device?.deviceUid);

  if (!data.length) {
    bulletsState.data.forEach(bullet => bullet.previousValue = bullet.value);
    return;
  }

  const takePreviousValuesFromStorage = data[0][1];

  bulletsState.data.forEach(bullet => {
    const items = takePreviousValuesFromStorage[`${bullet.name} ${bullet.units}`];
    const lastItem = items[items.length - 1];
    bullet.previousValue = lastItem.value;
  });
}

export {
  toBoxData,
  parseOtherParams,
  handleOtherParam,
  getFieldByType,
  pushOrInsertArray,
  minMaxSeries,
  createSensors,
  extractDataFromDeviceDefinition,
  createStorage,
  updatePreviousValue,
  Storage
};
