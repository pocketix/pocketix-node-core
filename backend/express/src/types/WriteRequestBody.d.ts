import {InputData} from '../../../influx-database/api/influxTypes';

interface WriteRequestBody {
    bucket: string;
    data: InputData[];
}

export {WriteRequestBody};
