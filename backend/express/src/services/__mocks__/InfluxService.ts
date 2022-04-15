import {InfluxQueryInput, InfluxQueryResult, InputData} from '../../../../InfluxDataBase/api/influxTypes';

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
}

export { InfluxService };
