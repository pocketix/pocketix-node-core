import {Series} from "@swimlane/ngx-charts/lib/models/chart-data.model";
import {ParameterType} from "../../../../generated/models/parameter-type";

type CurrentDayState = {
  data: Series[];
  date: Date;
  fields: ParameterType[];
  switchComposition: Series[];
  dataLoading: boolean;
};

type PastDaysState = {
  data: Series[];
  startDate: Date;
  endDate: Date;
  ticks: string[];
  dataLoading: boolean;
}

export {CurrentDayState, PastDaysState};
