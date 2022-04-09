import {InputData} from 'influx-aws-lambda/api/influxTypes';

interface WriteRequestBody {
    bucket: string;
    data: InputData[];
}

export {WriteRequestBody};
