import * as d3 from "d3";
import {ParameterValue} from "../../../generated/models/parameter-value";
import {Device} from "../../../generated/models/device";
import {LineState} from "../../components/line/model/line.model";
import {DataItem} from "@swimlane/ngx-charts/lib/models/chart-data.model";
import {Bullet, BulletsState} from "../model/dashboards.model";
import {InfluxQueryResult} from "../../../generated/models/influx-query-result";

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

const createSensors = (lineState: LineState, fields: string[]) => {
  const sensorIds = lineState.selectedDevicesToCompareWith.map(item => item.id);
  const sensors = Object.fromEntries(sensorIds.map(deviceUid => [deviceUid as string, fields]));
  sensors[lineState.device?.deviceUid as string] = fields;
  return {fields, sensorIds, sensors}
}

const getDeviceName = (lineState: LineState, measurement: string, id: string) => {
  if (!lineState.selectedDevicesToCompareWith.length)
    return measurement;

  return `${[...lineState.allDevices, {
    id: lineState.device.deviceUid,
    name: lineState.device.deviceName
  }].find(device => device.id === id)?.name || id}: ${measurement}`
}

const extractDataFromDeviceDefinition = (device: Device) => {
  const otherParameters = device?.parameterValues?.filter(value => typeof value.number != "number" || value.visibility != 3) ?? [];
  const data = otherParameters.map(parseOtherParams);

  return [
    ...data,
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

const handleMultipleLines = (lineState: LineState, sensorIds: any[], storage: Storage) => {
  if (!sensorIds.length) {
    return Object.entries(storage[lineState.device.deviceUid as string]).map(([name, series]) => ({
      name: name,
      series: series
    }));
  }

  return Object.entries(storage).map(([id, fieldStorage]) => {
    return Object.entries(fieldStorage).map(([measurement, series]) =>
      ({name: getDeviceName(lineState, measurement, id), series: series})
    )
  }).reduce((previousValue, currentValue) => {
    previousValue.push(...currentValue);
    return previousValue;
  }, [] as any[]);
}

function storageToSparklines(lineState: LineState, storage: Storage) {
  const parsedStorage = Object.entries(storage).map(([id, data]) =>
    Object.entries(data).map(([measurement, series]) => ({id, measurement, series}))
  );

  const sparklineData = {} as any;
  for (const sensor of parsedStorage) {
    for (const measurement of sensor) {
      const value = {
        name: getDeviceName(lineState, measurement.measurement, measurement.id),
        series: measurement.series
      };

      pushOrInsertArray(measurement.measurement, sparklineData, value)
    }
  }
  return sparklineData;
}

const parameterValueToBullet = (parameterValue: ParameterValue) => ({
  value: parameterValue.number ?? 0,
  min: parameterValue.type.min ?? 0,
  max: parameterValue.type.max ?? 0,
  previousValue: parameterValue.number ?? 0,
  thresholds: [parameterValue.type.threshold1 ?? 0, parameterValue.type.threshold2 ?? 0].sort(),
  units: parameterValue.type.units ?? "",
  name: parameterValue.type.label ?? ""
} as Bullet)

const createMappingFromParameterValues = (parameterValues: ParameterValue[]): (field: string) => string => {
  return (field: string) => parameterValues.find(value => value.type.name === field)?.type.label ?? field;
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
  getDeviceName,
  handleMultipleLines,
  storageToSparklines,
  parameterValueToBullet,
  createMappingFromParameterValues,
  Storage
};
