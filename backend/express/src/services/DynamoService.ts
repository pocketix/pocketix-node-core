import {
    ComparisonOperator,
    InfluxQueryInput,
    InfluxQueryResult,
    InputData, SingleSimpleValue
} from "../../../InfluxDataBase/api/influxTypes";

import {StatisticsService} from "./StatisticsService";
import {Service} from "typedi";


@Service()
class DynamoService implements StatisticsService{
    async average(query: InfluxQueryInput): Promise<InfluxQueryResult> {
        return Promise.resolve(undefined);
    }

    differenceBetweenFirstAndLast(data: InfluxQueryInput): Promise<InfluxQueryResult> {
        return Promise.resolve(undefined);
    }

    filterDistinctValue(data: InfluxQueryInput, isString: boolean, shouldCount: boolean, values: SingleSimpleValue[]): Promise<InfluxQueryResult> {
        return Promise.resolve(undefined);
    }

    lastOccurrenceOfValue(data: InfluxQueryInput, operator: ComparisonOperator, value: { [p: string]: any }): Promise<InfluxQueryResult> {
        return Promise.resolve(undefined);
    }

    parameterAggregationWithMultipleStarts(data: InfluxQueryInput, starts: string[]): Promise<InfluxQueryResult> {
        return Promise.resolve(undefined);
    }

    saveData(data: InputData[], bucket: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    saveOne(data: InputData, bucket: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    statistics(query: InfluxQueryInput): Promise<InfluxQueryResult> {
        return Promise.resolve(undefined);
    }

}
