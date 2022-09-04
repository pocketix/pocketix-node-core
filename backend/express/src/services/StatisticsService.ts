import {
    ComparisonOperator,
    InfluxQueryInput,
    InfluxQueryResult,
    InputData, SingleSimpleValue
} from "../../../InfluxDataBase/api/influxTypes";

interface StatisticsService {
    statistics(query: InfluxQueryInput): Promise<InfluxQueryResult>;

    average(query: InfluxQueryInput): Promise<InfluxQueryResult>;

    saveOne(data: InputData, bucket: string): Promise<void>;

    saveData(data: InputData[], bucket: string): Promise<void>;

    differenceBetweenFirstAndLast(data: InfluxQueryInput): Promise<InfluxQueryResult>;

    lastOccurrenceOfValue(data: InfluxQueryInput, operator: ComparisonOperator, value: { [key: string]: any }): Promise<InfluxQueryResult>;

    parameterAggregationWithMultipleStarts(data: InfluxQueryInput, starts: string[]): Promise<InfluxQueryResult>;

    filterDistinctValue(data: InfluxQueryInput,
                        isString: boolean,
                        shouldCount: boolean,
                        values: SingleSimpleValue[]): Promise<InfluxQueryResult>;
}

export {StatisticsService};
