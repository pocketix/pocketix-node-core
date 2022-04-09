import {
    ComparisonOperator,
    InfluxQueryInput,
    InfluxQueryResult,
    InputData,
    OutputData,
    Sensors,
    SingleSimpleValue
} from './influxTypes';

export interface IInflux {
    measurementDefault: string;
    dateField: string;
    bucket: string;

    /**
     * Save single point to influx
     * @param data Object representing data
     * @param bucket bucket override defaults to this.bucket
     * @param measurement Name of the measurement inside of InfluxDB bucket (most likely Sensor ID)
     * @param tags data to extract to tags
     */
    saveOne(data: InputData,
            bucket: string,
            measurement?: string,
            tags?: string[]): Promise<void>;

    /**
     * Save data to influx
     * @param data Array of input data items
     * @param bucket bucket override defaults to this.bucket
     * @param measurement Name of the measurement inside of InfluxDB bucket (most likely Sensor ID)
     * @param tags data to extract to tags
     */
    saveData(data: InputData[],
             bucket: string,
             measurement?: string,
             tags?: string[]): Promise<void>;

    /**
     * Queries data from influx, if start and stop are not provided sensor data returns last month
     * @param sensors sensors to query
     * @param start start of querying window
     * @param stop end of querying window
     * @param aggregateMinutes how many minutes should be aggregated into one result
     * @param aggregation an aggregation that should be performed
     * @param timezone timezone override
     */
    query(sensors: Sensors,
          start?: string,
          stop?: string,
          aggregateMinutes?: number,
          aggregation?: string,
          timezone?: string): Promise<OutputData[]>;

    /**
     * Queries data from Influx and converts them from/to API format
     * @param data InfluxQuery in InfluxQueryInput format
     */
    queryApi(data: InfluxQueryInput): Promise<InfluxQueryResult>;

    /**
     * Calculates difference between first and last item
     * @param data InfluxQuery in InfluxQueryInput format
     */
    differenceBetweenFirstAndLast(data: InfluxQueryInput): Promise<InfluxQueryResult>;

    /**
     * Get last occurrence of value in field
     * @param data Input data
     * @param operator Operator to check with
     * @param value Value to compare against
     */
    lastOccurrenceOfValue(data: InfluxQueryInput,
                          operator: ComparisonOperator,
                          value: { [key: string]: any }): Promise<InfluxQueryResult>;

    /**
     * Run aggregation for each combination of start in starts and InfluxQueryInputParam.to
     * The InfluxQueryInputParam.from parameter is also used and should be same or before the earliest item of starts
     * @param data Input data
     * @param starts Array of dates to start from
     */
    parameterAggregationWithMultipleStarts(data: InfluxQueryInput, starts: string[]): Promise<InfluxQueryResult>;

    /**
     * Filter distinct value in data.sensors
     * @param data Input data
     * @param isString if data field is string type
     * @param shouldCount should be only counted and not returned
     * @param values field values and their mapping
     */
    filterDistinctValue(data: InfluxQueryInput,
                        isString: boolean,
                        shouldCount: boolean,
                        values: SingleSimpleValue[]): Promise<InfluxQueryResult>;
}
