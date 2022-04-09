import {
    fluxDateTime,
    fluxInteger,
    fluxString,
    HttpError,
    InfluxDB,
    Logger,
    Point,
    setLogger
} from '@influxdata/influxdb-client';
import {BucketsAPI, OrgsAPI} from '@influxdata/influxdb-client-apis';
import {
    ComparisonOperator,
    InfluxQueryInput,
    InfluxQueryResult,
    InputData,
    Operation,
    OutputData,
    Sensors,
    SensorsWithFields,
    SimpleSensors,
    SingleSimpleValue
} from './influxTypes';

import {Agent as HttpAgent} from 'http';
import {Agent as HttpsAgent} from 'https';
import {IInflux} from './IInflux';
import {
    differenceBetweenFirstAndLast,
    filterDistinctValue,
    lastOccurrenceOfValue,
    parameterAggregationWithMultipleStarts,
    queryFromTo
} from './queries';

export const areSimpleSensors = (sensors: Sensors): boolean => {
    return Array.isArray(sensors);
};

class Influx implements IInflux {
    /**
     * Create new influx instance
     * @param url - url to connect to
     * @param org - name of the organisation
     * @param token - authorization token
     * @param bucket - database to write to
     * @param host - host, if sharding is used, defaults to "host1"
     */
    constructor(url: string, org: string, token: string, bucket: string, host: string = 'host1') {
        const agent = this.createAgent(url);
        this.client = new InfluxDB({url, token, transportOptions: {agent}});
        this.hostProperty = host;
        this.org = org;
        this.bucketProperty = bucket;
    }

    get measurementDefault(): string {
        return this.measurementDefaultProperty;
    }

    public set measurementDefault(value: string) {
        this.measurementDefaultProperty = value;
    }

    get dateField(): string {
        return this.dateFieldProperty;
    }

    public set dateField(value: string) {
        this.dateFieldProperty = value;
    }

    get bucket(): string {
        return this.bucketProperty;
    }

    set bucket(value: string) {
        this.bucketProperty = value;
    }

    get host(): string {
        return this.hostProperty;
    }

    set host(value: string) {
        this.hostProperty = value;
    }

    private readonly client;
    private readonly org: string;
    private readonly keepAliveDuration: number = 15 * 1000; // 15 seconds
    private hostProperty: string;
    private bucketProperty: string;
    private measurementDefaultProperty = 'deviceUid';
    private dateFieldProperty = 'tst';

    /**
     * Convert value and add it to field of point
     * @param point point to update
     * @param key field key
     * @param value value to convert and add
     */
    private static convertValueAndUpdatePoint(point: Point, key: string, value: any): Point {
        // Influx requires the same data type to be used (for example it is impossible to mix float and string in the same measurement).
        // This is because of the delta compression used. It is better to not save null at all.
        // Same with NaN (which is tested by comparing it with itself (https://tc39.es/ecma262/#sec-isnan-number)
        const isNan = value !== value; // not to be confused with isNaN function!. isNaN would also drop strings, objects...

        if (value === null || isNan) {
            return point;
        }

        // If it is a boolean save it
        if (typeof value === 'boolean') {
            return point.booleanField(key, value);
        }

        if (typeof value === 'number' || !isNaN(Number(value))) {
            point.floatField(key, value);
        } else {
            point.stringField(key, typeof value === 'string' ? value : JSON.stringify(value));
        }

        return point;
    }

    /**
     * Create flux filter
     * @param sensors Sensors with info
     */
    private static createFilterFunction(sensors: Sensors): string {
        if (areSimpleSensors(sensors)) {
            return (sensors as SimpleSensors).map((sensor: string) => `r["_measurement"] == ${fluxString(sensor)}`).join(' or ');
        }

        const getFields = (fields: string[]) => fields.map((field: string) =>
            `r["_field"] == ${fluxString(field)}`
        ).join(' or ');

        return Object.entries((sensors as SensorsWithFields)).map(([sensor, fields]) => {
            const and = !fields.length ? '' : ' and ';
            return `(r["_measurement"] == ${fluxString(sensor)}${and}(${getFields(fields)}))`;
        }).join(' or ');
    }

    /**
     * Convert input to Date or use current date if everything fails
     * @param date date to convert
     */
    private static inputToDate(date: any): Date {
        if (typeof date === 'number') { // Date is unix timestamp
            return new Date(date * 1000);
        }

        if (typeof date === 'string') { // Date is iso string
            return new Date(date);
        }

        if (date instanceof Date) { // Date was already converted
            return date;
        }

        return new Date(); // Date could not be converted, use current date as fallback
    }

    /**
     * Generate aggregation string for Influx.
     * If aggregateMinutes is not set the aggregation should be always skipped.
     * Also overrides the default UTC timezone if the timezone parameter is present.
     * On reasons why this is important see https://www.influxdata.com/blog/time-zones-in-flux/.
     * @param minutes the amount of minutes to aggregate
     * @param aggregation the aggregation to perform, defaults to mean
     * @param timezone timezone override
     */
    private static generateCorrectAggregationType(minutes?: number, aggregation: string = 'mean', timezone?: string): string {
        const zone = timezone ? `, location: timezone.location(name: ${fluxString(timezone)})` : '';

        if (aggregation === '') {
            aggregation = 'mean';
        }

        if (minutes) {
            return `|> aggregateWindow(every: ${minutes ? fluxInteger(minutes) : ''}m, fn: ${aggregation}, createEmpty: false ${zone})`;
        }
        // No aggregateMinutes mean no aggregation
        return '';
    }

    private static convertTimeToQueryTimePart(start: string | undefined, stop: string | undefined): string {
        return typeof start === 'undefined' || typeof stop === 'undefined' ?
            'start: -30d' :
            `start: ${fluxDateTime(new Date(start).toISOString())}, stop: ${fluxDateTime(new Date(stop).toISOString())}`;
    }

    /**
     * Save single point to influx
     * @param data Object representing data
     * @param bucket bucket override defaults to this.bucket
     * @param measurement Name of the measurement inside of InfluxDB bucket (most likely Sensor ID)
     * @param tags data to extract to tags
     */
    async saveOne(data: InputData,
                  bucket: string = this.bucketProperty,
                  measurement: string = this.measurementDefault,
                  tags: string[] = ['deviceType']): Promise<void> {
        await this.saveData([data], bucket, measurement, tags);
    }

    /**
     * Save data to influx
     * @param data Array of input data items
     * @param bucket bucket override defaults to this.bucket
     * @param measurement Name of the measurement inside of InfluxDB bucket (most likely Sensor ID)
     * @param tags data to extract to tags
     */
    async saveData(data: InputData[],
                   bucket: string = this.bucketProperty,
                   measurement: string = this.measurementDefault,
                   tags: string[] = ['deviceType']): Promise<void> {
        this.bucket = bucket;
        const points = this.transformToPointTags(data, measurement, tags);
        await this.insertManyPoints(points);
    }

    /**
     * Queries data from influx, if start and stop are not provided sensor data returns last month
     * @param sensors sensors to query
     * @param start start of querying window
     * @param stop end of querying window
     * @param aggregateMinutes how many minutes should be aggregated into one result
     * @param aggregation an aggregation that should be performed
     * @param timezone timezone override
     */
    async query(sensors: Sensors,
                start?: string,
                stop?: string,
                aggregateMinutes?: number,
                aggregation?: string,
                timezone?: string): Promise<OutputData[]> {
        const time = Influx.convertTimeToQueryTimePart(start, stop);
        const query = this.generateQuery(sensors, time, aggregateMinutes, aggregation, timezone);
        return await this.executeQuery(query);
    }

    /**
     * Calculates difference between first and last item
     * @param data InfluxQuery in InfluxQueryInput format
     */
    async differenceBetweenFirstAndLast(data: InfluxQueryInput): Promise<InfluxQueryResult> {
        const output = {status: 0, data: {}} as InfluxQueryResult;
        try {
            output.data = await this.createAndRunDifferenceBetweenFirstAndLast(data);
        } catch (error) {
            output.status = error instanceof HttpError ? (error as HttpError).statusCode : -1;
            output.error = `${(error as Error).message}\n\nstack:\n${(error as Error).stack}`;
        }

        return output;
    }

    /**
     * Get last occurrence of value in field
     * @param data Input data
     * @param operator Operator to check with
     * @param value Value to compare against
     */
    async lastOccurrenceOfValue(data: InfluxQueryInput,
                                operator: ComparisonOperator,
                                value: { [key: string]: any }): Promise<InfluxQueryResult> {
        const output = {status: 0, data: {}} as InfluxQueryResult;
        try {
            output.data = await this.createAndRunLastOccurrenceOfValue(data, operator, value);
        } catch (error) {
            output.status = error instanceof HttpError ? (error as HttpError).statusCode : -1;
            output.error = `${(error as Error).message}\n\nstack:\n${(error as Error).stack}`;
        }

        return output;
    }

    /**
     * Run aggregation for each combination of start in starts and InfluxQueryInputParam.to
     * The InfluxQueryInputParam.from parameter is also used and should be same or before the earliest item of starts
     * @param data Input data
     * @param starts Array of dates to start from
     */
    async parameterAggregationWithMultipleStarts(data: InfluxQueryInput, starts: string[]): Promise<InfluxQueryResult> {
        const output = {status: 0, data: {}} as InfluxQueryResult;
        try {
            const time = Influx.convertTimeToQueryTimePart(data.param.from, data.param.to);
            const joinedSensors = Influx.createFilterFunction(data.param.sensors);
            const query = parameterAggregationWithMultipleStarts(data.bucket,
                time,
                joinedSensors,
                data.operation || 'mean' as Operation,
                starts.map(date => new Date(date)));
            output.data = await this.executeQuery(query);
        } catch (error) {
            output.status = error instanceof HttpError ? (error as HttpError).statusCode : -1;
            output.error = `${(error as Error).message}\n\nstack:\n${(error as Error).stack}`;
        }

        return output;
    }

    /**
     * Filter distinct value in data.sensors
     * @param data Input data
     * @param isString if data field is string type
     * @param shouldCount should be only counted and not returned
     * @param values field values and their mapping
     */
    async filterDistinctValue(data: InfluxQueryInput,
                              isString: boolean,
                              shouldCount: boolean,
                              values: SingleSimpleValue[]): Promise<InfluxQueryResult> {
        const output = {status: 0, data: {}} as InfluxQueryResult;
        try {
            const to = data.param.to ? new Date(data.param.to) : new Date();
            const time = Influx.convertTimeToQueryTimePart(data.param.from, data.param.to);
            const joinedSensors = Influx.createFilterFunction(data.param.sensors);
            const query = filterDistinctValue(data.bucket, time, joinedSensors, isString, shouldCount, values, to);
            output.data = await this.executeQuery(query);
        } catch (error) {
            output.status = error instanceof HttpError ? (error as HttpError).statusCode : -1;
            output.error = `${(error as Error).message}\n\nstack:\n${(error as Error).stack}`;
        }

        return output;
    }

    private async createAndRunLastOccurrenceOfValue(data: InfluxQueryInput,
                                                    operator: ComparisonOperator,
                                                    value: {[key: string]: any}): Promise<OutputData[]> {
        const time = Influx.convertTimeToQueryTimePart(data.param.from, data.param.to);
        const joinedSensors = Influx.createFilterFunction(data.param.sensors);
        const query = lastOccurrenceOfValue('', data.bucket, time, joinedSensors, '', operator, value);
        return await this.executeQuery(query);
    }

    private async createAndRunDifferenceBetweenFirstAndLast(data: InfluxQueryInput): Promise<OutputData[]> {
        const time = Influx.convertTimeToQueryTimePart(data.param.from, data.param.to);
        const joinedSensors = Influx.createFilterFunction(data.param.sensors);
        const query = differenceBetweenFirstAndLast('', data.bucket, time, joinedSensors, '');
        return await this.executeQuery(query);
    }

    /**
     * Queries data from Influx and converts them from/to API format
     * @param data InfluxQuery in InfluxQueryInput format
     */
    async queryApi(data: InfluxQueryInput): Promise<InfluxQueryResult> {
        this.bucket = data.bucket;
        const sensors = data.param.sensors;
        const start = data.param.from;
        const stop = data.param.to;
        const aggregateMinutes = data.param.aggregateMinutes;
        const aggregationMethod = data.operation;
        const timezone = data.param.timezone;
        const output = {status: 0, data: {}} as InfluxQueryResult;

        try {
            const outputData = await this.query(sensors, start, stop, aggregateMinutes, aggregationMethod, timezone);
            output.data = outputData as OutputData[];
        } catch (error) {
            output.status = error instanceof HttpError ? (error as HttpError).statusCode : -1;
            output.error = `${(error as Error).message}\n\nstack:\n${(error as Error).stack}`;
        }

        return output;
    }

    /**
     * Inserts transformed point to bucket. The bucket is created if it did not exist.
     * Logger is disabled during this so the unwanted error is not logged.
     * @param points points to insert
     */
    private async insertManyPoints(points: ArrayLike<Point>): Promise<void> {
        const writeApi = this.client.getWriteApi(this.org, this.bucketProperty, 's');
        writeApi.writePoints(points);
        const logger = setLogger(new NoOPLogger());
        await writeApi.flush().catch(async (error) => {
            if (!(error instanceof HttpError && error.statusCode === 404))  // Bucket maybe exists, but there is a different error
            {
                logger.error(error);
                throw error;
            }

            setLogger(logger);
            await this.createBucketIfNotExists(this.bucketProperty);
            writeApi.writePoints(points);
            await writeApi.close();
        }).finally(() => setLogger(logger));
    }

    /**
     * Convert Array of Object measurements to Array of InfluxDB Points
     * @param data Array of Objects with data, must contain field specified in this.dateField, measurement and all tags
     * @param measurement Name of the measurement inside of InfluxDB bucket (most likely Sensor ID)
     * @param tags Keys of additional tags
     * @returns Point[] Array of points
     */
    private transformToPointTags(data: InputData[], measurement: string, tags: string[]): ArrayLike<Point> {
        return data.map(pointData => {
            const keys = Object.keys(pointData).filter(x => ![...tags, this.dateFieldProperty, measurement].includes(x));
            const initialPoint = new Point(pointData[measurement])
                .timestamp(Influx.inputToDate(pointData[this.dateField]))
                .tag('host', this.hostProperty);
            const taggedPoint = tags.reduce((point, tag) => point.tag(tag, pointData[tag]), initialPoint);
            return keys.reduce((point, key) => Influx.convertValueAndUpdatePoint(point, key, pointData[key]), taggedPoint);
        });
    }

    /**
     * Execute provided query in influx
     * @param query query to execute
     */
    private async executeQuery(query: string): Promise<OutputData[]> {
        const queryApi = this.client.getQueryApi(this.org);
        let response: OutputData[] = [];
        await queryApi.collectRows(query).then(
            (values => response = values as OutputData[]),
            (error) => {
                throw new Error(error);
            }
        );

        return response;
    }

    /**
     * Generate query executable in Influx
     * @param sensors queried sensors
     * @param time start and stop of window
     * @param minutes how many minutes should be aggregated
     * @param aggregation the type of aggregation to perform
     * @param timezone timezone override
     */
    private generateQuery(sensors: Sensors, time: string, minutes?: number, aggregation?: string, timezone?: string): string {
        const imports = timezone ? 'import "timezone"\n\n' : '';
        const joinedSensors = Influx.createFilterFunction(sensors);
        const aggregate = Influx.generateCorrectAggregationType(minutes, aggregation, timezone);

        return queryFromTo(imports, this.bucket, time, joinedSensors, aggregate);
    }

    /**
     * Get organization id of organization provided
     * @param org Input organization
     */
    private async orgStringToOrgId(org: string): Promise<string> {
        const orgApi = new OrgsAPI(this.client);
        const organizations = await orgApi.getOrgs({org});

        if (!organizations || !organizations.orgs || !organizations.orgs.length || !organizations.orgs[0].id) {
            throw Error('Organization does not exist');
        }

        return organizations.orgs[0].id;
    }

    /**
     * Create bucket if it doesn't exist
     * @param name Name of the bucket
     */
    private async createBucketIfNotExists(name: string): Promise<void> {
        const bucketsApi = new BucketsAPI(this.client);
        const org = await this.orgStringToOrgId(this.org);

        await bucketsApi.getBuckets({orgID: org, name}).catch(async error => {
            if (!(error instanceof HttpError && error.statusCode === 404)) {
                throw error;
            }

            await bucketsApi.postBuckets({body: {orgID: org, name, retentionRules: []}});
        });
    }

    /**
     * Creates new agent that will not close the connection for <code>this.keepAliveDuration</code> seconds.
     * The agent is chosen based on http(s) and the correct one is used.
     * Without this the connection to a https server can fail on the
     * @param url distinguish between http(s) based on url
     */
    private createAgent(url: string): HttpAgent | HttpsAgent {
        const agent = url.startsWith('https') ? HttpsAgent : HttpAgent;
        return new agent({
            keepAlive: true,
            keepAliveMsecs: this.keepAliveDuration,
            timeout: 2 * this.keepAliveDuration
        });
    }
}

class NoOPLogger implements Logger {
    error(message: string, err?: any): void {
    }

    warn(message: string, err?: any): void {
    }
}

export {Influx};
