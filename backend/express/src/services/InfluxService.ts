import {Influx} from 'influx-aws-lambda/api/Influx';
import { Service } from 'typedi';
import {
    ComparisonOperator,
    InfluxQueryInput,
    InfluxQueryResult,
    InputData,
    SingleSimpleValue
} from 'influx-aws-lambda/api/influxTypes';

/**
 * Simple service that wraps the 'Influx' class into an injectable service
 */
@Service()
class InfluxService {
    private influx: Influx;

    constructor() {
        this.influx = new Influx(process.env.INFLUX_URL, process.env.INFLUX_ORG, process.env.INFLUX_TOKEN, process.env.INFLUX_BUCKET);
    }

    public async statistics(query: InfluxQueryInput): Promise<InfluxQueryResult> {
        return await this.influx.queryApi(query);
    }

    public async average(query: InfluxQueryInput): Promise<InfluxQueryResult> {
        return await this.influx.queryApi(query);
    }

    public async saveOne(data: InputData, bucket: string): Promise<void> {
        await this.influx.saveOne(data, bucket);
    }

    public async saveData(data: InputData[], bucket: string): Promise<void> {
        await this.influx.saveData(data, bucket);
    }

    public async differenceBetweenFirstAndLast(data: InfluxQueryInput): Promise<InfluxQueryResult> {
        return await this.influx.differenceBetweenFirstAndLast(data);
    }

    public async lastOccurrenceOfValue(data: InfluxQueryInput, operator: ComparisonOperator, value: {[key: string]: any}): Promise<InfluxQueryResult> {
        return await this.influx.lastOccurrenceOfValue(data, operator, value);
    }

    public async parameterAggregationWithMultipleStarts(data: InfluxQueryInput, starts: string[]): Promise<InfluxQueryResult> {
        return await this.influx.parameterAggregationWithMultipleStarts(data, starts);
    }

    public async filterDistinctValue(data: InfluxQueryInput,
                                     isString: boolean,
                                     shouldCount: boolean,
                                     values: SingleSimpleValue[]): Promise<InfluxQueryResult> {
        return await this.influx.filterDistinctValue(data, isString, shouldCount, values);
    }

    public async logError(data: InputData): Promise<void> {
        await this.saveOne(data, process.env.INFLUX_ERROR_BUCKET);
    }

    public async logRequest(data: InputData): Promise<void> {
        await this.saveOne(data, process.env.INFLUX_LOGGING_BUCKET);
    }
}

export { InfluxService };
