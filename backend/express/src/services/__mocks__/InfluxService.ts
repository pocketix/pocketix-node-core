import {
    ComparisonOperator,
    InfluxQueryInput,
    InfluxQueryResult,
    InputData, SingleSimpleValue
} from '../../../../InfluxDataBase/api/influxTypes';

/**
 * Simple service that wraps the 'Influx' class into an injectable service
 */
class InfluxService {
    public async statistics(query: InfluxQueryInput): Promise<InfluxQueryResult> {
        return {} as unknown as InfluxQueryResult;
    }

    public async average(query: InfluxQueryInput): Promise<InfluxQueryResult> {
        return {} as unknown as InfluxQueryResult;
    }

    public async saveOne(data: InputData): Promise<void> {
        return;
    }

    public async saveData(data: InputData[]): Promise<void> {
        return;
    }

    public async differenceBetweenFirstAndLast(data: InfluxQueryInput): Promise<InfluxQueryResult> {
        return {} as unknown as InfluxQueryResult;
    }

    public async lastOccurrenceOfValue(data: InfluxQueryInput, operator: ComparisonOperator, value: {[key: string]: any}): Promise<InfluxQueryResult> {
        return {} as unknown as InfluxQueryResult;
    }

    public async parameterAggregationWithMultipleStarts(data: InfluxQueryInput, starts: string[]): Promise<InfluxQueryResult> {
        return {} as unknown as InfluxQueryResult;
    }

    public async filterDistinctValue(data: InfluxQueryInput,
                                     isString: boolean,
                                     shouldCount: boolean,
                                     values: SingleSimpleValue[]): Promise<InfluxQueryResult> {
        return {} as unknown as InfluxQueryResult;
    }

    public async logError(data: InputData): Promise<void> {
        return;
    }

    public async logRequest(data: InputData): Promise<void> {
        return;
    }
}

export { InfluxService };
