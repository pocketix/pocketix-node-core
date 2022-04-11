import * as d3 from "d3";
import {ParameterValue} from "../../../generated/models/parameter-value";

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

export {toBoxData, parseOtherParams, handleOtherParam, getFieldByType};
