import {OutputData} from "../../../../generated/models/output-data";

type Changes = OutputData & {time: Date, start: Date, stop: Date};

export {Changes}
