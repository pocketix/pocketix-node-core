import {Influx} from '../../../InfluxDataBase/api/Influx';
import {Service} from 'typedi';
import {
    ComparisonOperator,
    InfluxQueryInput,
    InfluxQueryResult,
    InputData,
    SingleSimpleValue
} from '../../../InfluxDataBase/api/influxTypes';
import {StatisticsService} from "./StatisticsService";

/**
 * Simple service that wraps the 'Influx' class into an injectable service
 */
@Service()
class InfluxService implements StatisticsService {
    private influx: Influx;

    constructor() {
        this.influx = new Influx(process.env.INFLUX_URL, process.env.INFLUX_ORG, process.env.INFLUX_TOKEN, process.env.INFLUX_BUCKET);
    }

    async statistics(query: InfluxQueryInput): Promise<InfluxQueryResult> {
        return await this.influx.queryApi(query);
    }

    async average(query: InfluxQueryInput): Promise<InfluxQueryResult> {
        return await this.influx.queryApi(query);
    }

    async saveOne(data: InputData, bucket: string): Promise<void> {
        await this.influx.saveOne(data, bucket);
    }

    async saveData(data: InputData[], bucket: string): Promise<void> {
        await this.influx.saveData(data, bucket);
    }

    async differenceBetweenFirstAndLast(data: InfluxQueryInput): Promise<InfluxQueryResult> {
        return await this.influx.differenceBetweenFirstAndLast(data);
    }

    async lastOccurrenceOfValue(data: InfluxQueryInput, operator: ComparisonOperator, value: { [key: string]: any }): Promise<InfluxQueryResult> {
        return await this.influx.lastOccurrenceOfValue(data, operator, value);
    }

    async parameterAggregationWithMultipleStarts(data: InfluxQueryInput, starts: string[]): Promise<InfluxQueryResult> {
        return await this.influx.parameterAggregationWithMultipleStarts(data, starts);
    }

    async filterDistinctValue(data: InfluxQueryInput,
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
