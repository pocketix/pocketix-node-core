import {Series} from "@swimlane/ngx-charts/lib/models/chart-data.model";
import {ParameterType} from "../../../../generated/models/parameter-type";
import {Operation} from "../../../../generated/models/operation";

type CurrentDayState = {
  data: Series[];
  date: Date;
  fields: ParameterType[];
  switchComposition: Series[];
  dataLoading: boolean;
  allAggregationOperations: Operation[];
  selectedAggregationOperation: Operation;
};

type PastDaysState = {
  data: Series[];
  startDate: Date;
  endDate: Date;
  ticks: string[];
  dataLoading: boolean;
};

type KPIOptions = {
  all: ParameterType[];
  default: ParameterType[];
};

export {CurrentDayState, PastDaysState, KPIOptions};
