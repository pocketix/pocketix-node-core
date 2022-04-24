import {OutputData} from "../../../../generated/models/output-data";

type Changes = OutputData & {time: Date, start: Date, stop: Date};

type SwitchDisplayClickedEvent = {
  data: SwitchDisplayElementData,
  originalEvent: PointerEvent
};

type SwitchDisplayElementData = {
  dates: Date[],
  data: OutputData
};

export {Changes, SwitchDisplayClickedEvent, SwitchDisplayElementData};
