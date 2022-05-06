import * as d3 from "d3";
import {ParameterValue} from "../../../generated/models/parameter-value";
import {Device} from "../../../generated/models/device";
import {LineState} from "../../components/line/model/line.model";
import {DataItem, Series} from "@swimlane/ngx-charts/lib/models/chart-data.model";
import {Bullet, BulletsState, Storage} from "../model/dashboards.model";
import {InfluxQueryResult} from "../../../generated/models/influx-query-result";
import {ParameterType} from "../../../generated/models/parameter-type";
import {CurrentDayState, PastDaysState} from "../../components/categorical/model/categorical.model";
import {OutputData} from "../../../generated/models/output-data";
import * as _ from "lodash";

/**
 * Convert series to box data
 * ApexCharts does not provide its own functions, so you have to use this helper or convert it yourselves
 * @param series series to convert
 */
const toBoxData = (series: DataItem[]) => {
  const sortedSeries = series.map(item => item.value).sort();
  const q1 = _.round(d3.quantile(sortedSeries, .25) as number, 2);
  const median = _.round(d3.quantile(sortedSeries, .5) as number, 2);
  const q3 = _.round(d3.quantile(sortedSeries, .75) as number, 2);
  const interQuantileRange = q3 - q1;
  const min = q1 - 1.5 * interQuantileRange;
  const max = q1 + 1.5 * interQuantileRange;

  const data = [_.round(min, 2), q1, median, q3, _.round(max, 2)];

  return (max - min) < 0.5 ? undefined : data;
}

/**
 * Parse other params from parameter values
 * @param param parameter to read from
 */
const parseOtherParams = (param: ParameterValue) => {
  let field = getFieldByType(param);
  return handleOtherParam(param.type.name, field, param.type.label);
}

/**
 * Make best estimate to get data from the parameter value
 * @param name parameter name
 * @param field database field which contains data
 * @param label string label
 */
const handleOtherParam = (name: string, field: any, label: string) => {
  // Try to convert date
  if (name.toLowerCase().includes("date") && typeof field === "number") {
    field = new Date(field * 1000).toLocaleString();
  }

  // Try magic
  return [field, label
    .split(/([A-Z][a-z]+)/)
    .map((item: string) => item.trim())
    .filter((element: any) => element)
    .join(' ')
  ];
}

/**
 * Get field by type
 * @param param parameter to read from
 */
const getFieldByType = (param: ParameterValue) => {
  switch (param.type.type) {
    case "string":
      return param.string;
    case "number":
      return param.number;
  }
  return undefined;
}

/**
 * Create storage using items and line state
 * Copy only selected fields and use mapping to map name to label / different names
 * @param lineState current line state
 * @param items items from Influx
 * @param fields fields to get
 * @param mapping mapping to use
 */
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
      storage[item.sensor][mapping(field)].push({value: _.round(Number(item[field]), 2), name: new Date(item.time)});
    })
  });
  return {storage, thresholdLines};
}

/**
 * Simplify upserting to array to an object
 * @param key key to upsert to
 * @param object object to upsert to
 * @param value value to upsert or create new array containing it
 */
const pushOrInsertArray = (key: string, object: any, value: any) => {
  if (object[key])
    object[key].push(value);
  else
    object[key] = [value];

  return object;
};

/**
 * Get minimum and maximum thresholds from two lines
 * @param device current device
 * @param field fields to get thresholds for
 */
const minMaxSeries = (device: Device, field: string): {name: string, value: number}[] => {
  const parameter = device?.parameterValues?.find(parameter => parameter?.type?.name === field);
  // sort the thresholds
  let thresholds = [parameter?.type?.threshold1, parameter?.type?.threshold2].sort();
  thresholds = thresholds.filter(threshold => threshold !== undefined);

  if (!thresholds)
    return [];

  // Same thresholds clip label and don't look too good
  if (thresholds[0] === thresholds[1])
    delete thresholds[1];

  return thresholds.length === 1 ?
    [{value: thresholds[0] || 0, name: "Threshold"}] :
    [{value: thresholds[0] || 0, name: "Minimum"}, {value: thresholds[1] || 0, name: "Maximum"}];
}

/**
 * Lazy helper, get sensor definitions for Influx from relation database description and current line state
 * @param lineState current line state
 * @param fields fields to get
 */
const createSensors = (lineState: LineState, fields: string[]) => {
  const sensorIds = lineState.selectedDevicesToCompareWith.map(item => item.id);
  const sensors = Object.fromEntries(sensorIds.map(deviceUid => [deviceUid as string, fields]));
  sensors[lineState.device?.deviceUid as string] = fields;
  return {fields, sensorIds, sensors}
}

/**
 * Get name of the current measurement, try to handle multiple devices by prepending the name of the device
 * @param lineState current line state
 * @param measurement measurement name
 * @param id current device id
 */
const getDeviceName = (lineState: LineState, measurement: string, id: string) => {
  if (!lineState.selectedDevicesToCompareWith.length)
    return measurement;

  return `${[...lineState.allDevices, {
    id: lineState.device.deviceUid,
    name: lineState.device.deviceName
  }].find(device => device.id === id)?.name || id}: ${measurement}`
}

/**
 * Extract other data from device definition
 * @param device device to get data from
 */
const extractDataFromDeviceDefinition = (device: Device) => {
  const otherParameters = device?.parameterValues?.filter(value => typeof value.number != "number" || value.visibility != 3) ?? [];
  const data = otherParameters.map(parseOtherParams);

  return [
    ...data,
    [device.deviceUid, "Device Id"],
    [(new Date(device.lastSeenDate)).toLocaleString(), "Last Seen"],
    [(new Date(device.registrationDate)).toLocaleString(), "Registered At"],
    [device.latitude, "Latitude"],
    [device.longitude, "Longitude"]
  ]
}

/**
 * Update previous values of bullet states
 * @param bulletsState bullet states to update
 * @param storage storage to get data from
 */
const updatePreviousValue = (bulletsState: BulletsState, storage: { [sensor: string]: { [field: string]: any[]; }; }) => {
  const data = Object.entries(storage).filter(([key, _]) => key !== bulletsState.device?.deviceUid);

  if (!data.length) {
    bulletsState.data.forEach(bullet => bullet.previousValue = bullet.value);
    return;
  }

  const takePreviousValuesFromStorage = data[0][1];

  bulletsState.data.forEach(bullet => {
    const items = takePreviousValuesFromStorage[`${bullet.name}`];
    const lastItem = items[items.length - 1];
    bullet.previousValue = lastItem.value;
  });
}

/**
 * Try to handle lines from multiple devices if possible
 * @param lineState current line state
 * @param sensorIds ids of the sensors
 * @param storage storage metadata
 */
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

/**
 * Convert line state to sparklines
 * @param lineState current line state
 * @param storage storage metadata
 */
const storageToSparklines = (lineState: LineState, storage: Storage) => {
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

/**
 * Create bullet values from parameter values
 * @param parameterValue data source
 */
const parameterValueToBullet = (parameterValue: ParameterValue) => ({
  value: parameterValue.number ?? 0,
  min: parameterValue.type.min ?? 0,
  max: parameterValue.type.max ?? 0,
  previousValue: parameterValue.number ?? 0,
  thresholds: [parameterValue.type.threshold1 ?? 0, parameterValue.type.threshold2 ?? 0].sort(),
  units: parameterValue.type.units ?? "",
  name: parameterValue.type.label ?? ""
} as Bullet)

/**
 * Create the name to label mapping from device
 * @param parameterValues parameter values to create the mapping from
 */
const createMappingFromParameterValues = (parameterValues: ParameterValue[]): (field: string) => string => {
  return (field: string) => parameterValues.find(value => value.type.name === field)?.type.label ?? field;
}

/**
 * Helper to get aggregation minutes from time window and point count
 * @param start start of the window
 * @param stop end of the window
 * @param pointCount maximum point count
 */
const twoDatesAndPointCountToAggregationMinutes = (start: Date, stop: Date, pointCount: number): number => {
  const [startMilliseconds, stopMilliseconds] = [start.getTime(), stop.getTime()].sort();
  const millisecondsBetween = stopMilliseconds - startMilliseconds;
  const minutes = Math.floor(millisecondsBetween / 1000 / 60);

  return Math.floor(minutes / pointCount);
};

/**
 * Convert KPI represented by ParameterType to viewable KPI
 * @param name KPI name
 * @param optionsKPI all options
 */
const kpiParamToKpi = (name: string, optionsKPI: ParameterType[]) => {
  const parameter = optionsKPI.find((current: ParameterType) => current.name === name);
  return parameter ? parameter.label : name;
};

/**
 * Create default value for all fields
 * @param fields fields to create default values for
 */
const createDefaultValue = (fields: ParameterType[]): {[key: string]: number} => {
  const a = fields.map((parameter) => parameter.name);
  return a.reduce((previous, kpi) => {
    previous[kpi] = 0;
    return previous;
  }, {} as {[key: string]: number});
};

/**
 * Create manual ticks from two dates
 * @param pastDays current state
 */
const createPastDaysSwitchDataTicks = (pastDays: PastDaysState) => {
  const start = new Date(pastDays.startDate.setHours(0, 0, 0, 0));
  start.setDate(start.getDate() + 1);
  const dates = [];

  while (start < pastDays.endDate) {
    dates.push(start.toDateString());
    start.setDate(start.getDate() + 1);
  }
  pastDays.ticks = dates;
};

/**
 * Convert OutputData to ngx-charts DataItem
 * @param item item to convert
 * @param group current group
 * @param options all parameter options
 */
const createNgxNameValuePair = (item: OutputData, group: string, options: ParameterType[]): DataItem => {
  return {name: kpiParamToKpi(group, options), value: item[group] && typeof item[group] === "number" ? +item[group] : 0};
};

/**
 * InfluxQueryResult to Barchart
 * @param items items to convert
 * @param options options to use
 * @param fields fields to use
 * @param dateTransformer how to transform date
 */
const itemsToBarChart = (items: InfluxQueryResult,
                         options: ParameterType[],
                         fields: ParameterType[],
                         dateTransformer: (value: string) => string): Series[] => {
  const data = items?.data as OutputData[];
  return data.map(item => ({
    name: dateTransformer(item.time),
    series: fields.map(parameter => createNgxNameValuePair(item, parameter.name, options))
  }));
};

/**
 * Sum InfluxQueryResult's data into groups based on options and current state, useful for compositions
 * @param item items to group
 * @param currentDay current day state
 * @param optionsKPI kpi options
 */
const sumGroups = (item: InfluxQueryResult, currentDay: CurrentDayState, optionsKPI: ParameterType[]): {[p: string]: number} => {
  const data = item.data.reduce((previousValue, currentValue) => {
      const values = Object.entries(currentValue).filter(([key, __]) =>
        currentDay.fields.find((parameter) => parameter.name === key)
      )
        .reduce((innerPreviousValue, [key, innerCurrentValue]) => {
          innerPreviousValue[key] += _.toNumber(innerCurrentValue);
          return innerPreviousValue;
        }, createDefaultValue(currentDay.fields));

      Object.entries(values).forEach(([key, value]) => previousValue[key] += value);
      return previousValue;
    },
    createDefaultValue(currentDay.fields));

  return Object.fromEntries(Object.entries(data).map(([key, value]) =>
    [kpiParamToKpi(key, optionsKPI), value])
  );
};

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
  twoDatesAndPointCountToAggregationMinutes,
  kpiParamToKpi,
  createDefaultValue,
  createPastDaysSwitchDataTicks,
  createNgxNameValuePair,
  itemsToBarChart,
  sumGroups
};
