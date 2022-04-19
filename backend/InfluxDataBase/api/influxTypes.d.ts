/**
 * Interface representing data to be stored in InfluxDB
 */
export interface InputData {
    /**
     * Timestamp, either as JavaScript Date object or as a number representing unix timestamp
     */
    tst: number | Date | string;

    /**
     * Other values to save
     */
    [key: string]: any;
}

/**
 * Interface representing single data point from InfluxDB
 */
export interface OutputData {
    /**
     * Result metadata, indicated what aggregate was used
     */
    result: string;
    /**
     * Table number metadata
     */
    table: number;
    /**
     * Time of the current data sample
     */
    time: string;
    /**
     * Sensor that the current sample belongs to
     */
    sensor: string;

    /**
     * Other values based on the incoming request
     */
    [key: string]: number | string;
}

/**
 * Result from InfluxDB
 */
export interface InfluxQueryResult {
    /**
     * Returned status
     */
    status: number;
    /**
     * Error if any
     */
    error?: string;
    /**
     * Array of OutputData
     */
    data: OutputData[];
}

/**
 * Input data to influx
 */
export interface InfluxQueryInput {
    /**
     * Operation to execute
     */
    operation: Operation;
    /**
     * Bucket to query from
     */
    bucket: string;
    /**
     * Data to query by
     */
    param: InfluxQueryInputParam;
}

/**
 * Aggregation operations that can be used.
 * The '' type represents default aggregation (when used with aggregateMinutes) or no aggregation (when used without).
 */
export type Operation = 'mean'
    | 'sum'
    | 'last'
    | ''
    | 'none'
    | 'count'
    | 'integral'
    | 'median'
    | 'mode'
    | 'quantile'
    | 'reduce'
    | 'skew'
    | 'spread'
    | 'stddev'
    | 'timeWeightedAvg';

/**
 * Comparison operators
 * eq - equal =
 * lt - less than <
 * gt - greater than >
 * leq - less or equal <=
 * geq - greater or equal >=
 */
export type ComparisonOperator = 'eq'
    | 'gt'
    | 'lt'
    | 'leq'
    | 'geq';

/**
 * Data used for querying the selected bucket
 */
export interface InfluxQueryInputParam {
    /**
     * Sensors to be queried
     */
    sensors: Sensors;
    /**
     * Start of the querying window
     */
    from?: string;
    /**
     * End of the querying window
     */
    to?: string;
    /**
     * Amount of minutes to aggregate by
     * For example if the queried range has 1 hour and aggregateMinutes is set to 10 the aggregation will result in 6 points
     */
    aggregateMinutes?: number;
    /**
     * Timezone override default UTC.
     * For more details why and how this affects queries see: https://www.influxdata.com/blog/time-zones-in-flux/.
     * In most cases you can ignore this and some edge aggregations can be influenced.
     * If you need a precise result or the aggregation uses high amount of minutes provide the target time zone.
     */
    timezone?: string;
}

/**
 * Sensors to be queried
 */
export type Sensors = SimpleSensors | SensorsWithFields;

/**
 * Simple definition, returns all available sensor fields
 */
export type SimpleSensors = string[];

/**
 * Return only the requested sensor fields
 */
export type SensorsWithFields = { [key: string]: string[] };

type SingleSimpleValue = string | number;
type SingleValueWithCustomMapping = [string | number, number];
type SingleValue = SingleSimpleValue | SingleValueWithCustomMapping;
