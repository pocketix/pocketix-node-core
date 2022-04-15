import {InputData} from '../../../InfluxDataBase/api/influxTypes';

interface WriteRequestBody {
    bucket: string;
    data: InputData[];
}

export {WriteRequestBody};
