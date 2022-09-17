import { InputData } from "../../../InfluxDataBase/api/influxTypes";
import {ObjectId} from "mongodb";


class MongoData implements InputData {
    [key: string]: any;

    tst: number | Date | string;

    _id: ObjectId
}

export {MongoData};
