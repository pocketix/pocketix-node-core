import {
    ComparisonOperator,
    InfluxQueryInput,
    InfluxQueryResult,
    InputData, SingleSimpleValue
} from "../../../influx-database/api/influxTypes";

interface StatisticsService {
    statistics(query: InfluxQueryInput): Promise<InfluxQueryResult>;

    average(query: InfluxQueryInput): Promise<InfluxQueryResult>;

    saveOne(data: InputData, bucket: string): Promise<void>;

    saveData(data: InputData[], bucket: string): Promise<void>;
}

export {StatisticsService};
