import {InfluxService} from '../services/InfluxService';
import {Container, Inject, Service} from 'typedi';
import {Body, Controller, Middlewares, Path, Post, Query, Request, Route, SuccessResponse, Tags} from 'tsoa';

import {
    ComparisonOperator,
    InfluxQueryInput,
    InfluxQueryInputParam,
    InfluxQueryResult,
    Operation,
    SingleSimpleValue
} from '../../../InfluxDataBase/api/influxTypes';
import {fromDateBeforeToDate} from '../validators/fromDateBeforeToDate';
import {ExitValidator} from '../middlewares/ExitValidator';
import {Request as ExpressRequest} from 'express';
import {createBucketName} from '../utility/createBucketName';
import {ReadRequestBody} from '../types/ReadRequestBody';
import {WriteRequestBody} from '../types/WriteRequestBody';
import {DeviceService} from "../services/DeviceService";

@Service()
@Route('statistics')
@Tags("statistics")
class StatisticsController extends Controller {
    @Inject()
    private influxService: InfluxService;
    @Inject()
    private deviceService: DeviceService;

    constructor() {
        super();
        this.influxService = Container.get(InfluxService);
    }

    /**
     * Get not aggregated data from sensors. May be between two dates (from and to).
     * The dates could be either both undefined or both defined
     * @param body The body of the request
     * @param request Express Request
     * @param from The start of the time window
     * @param to The end of the time window
     */
    @Post('')
    @Middlewares([fromDateBeforeToDate.fromDateBeforeToDate, ExitValidator.onErrors])
    public async statistics(@Body() body: ReadRequestBody,
                            @Request() request: ExpressRequest,
                            @Query() from?: Date,
                            @Query() to?: Date): Promise<InfluxQueryResult> {
        const fromString = from ? from.toISOString() : undefined;
        const toString = to ? to.toISOString() : undefined;
        const influxQuery = {
            operation: '',
            bucket: createBucketName(body.bucket),
            param: {sensors: body.sensors, from: fromString, to: toString} as InfluxQueryInputParam
        } as InfluxQueryInput;

        return await this.influxService.statistics(influxQuery);
    }

    /**
     * Get aggregated data from sensors. May be between two dates (from and to).
     * The dates could be either both undefined or both defined. Custom granularity can be set by using aggregateMinutes
     * @param body The body of the request
     * @param request Express request
     * @param operation The aggregation operation to execute.
     * @param from The start of the time window
     * @param to The end of the time window
     * @param aggregateMinutes The amount of time (in minutes) that should be aggregated into one sample
     */
    @Post('aggregate/{operation}')
    @Middlewares([fromDateBeforeToDate.fromDateBeforeToDate, ExitValidator.onErrors])
    public async aggregate(@Body() body: ReadRequestBody,
                           @Request() request: ExpressRequest,
                           @Path() operation: Operation = 'mean',
                           @Query() aggregateMinutes: number = 10,
                           @Query() from?: Date,
                           @Query() to?: Date): Promise<InfluxQueryResult> {
        const fromString = from ? from.toISOString() : undefined;
        const toString = to ? to.toISOString() : undefined;
        const influxQuery = {
            operation,
            bucket: createBucketName(body.bucket),
            param: {
                sensors: body.sensors,
                from: fromString,
                to: toString,
                aggregateMinutes,
                timezone: body.timezone
            } as InfluxQueryInputParam
        } as InfluxQueryInput;
        return await this.influxService.average(influxQuery);
    }

    /**
     * Save data to InfluxDB
     * @param body request body
     */
    @Post('data')
    @SuccessResponse('201', 'Created')
    public async saveData(@Body() body: WriteRequestBody): Promise<void> {
        await this.influxService.saveData(body.data, body.bucket);
        await Promise.all(body.data.map(async data => await this.deviceService.updateDeviceIfExists(data)));
    }

    /**
     * Get difference between first and last item value of selected items
     * @param data settings
     */
    @Post('differenceBetweenFirstAndLast')
    public async differenceBetweenFirstAndLast(@Body() data: InfluxQueryInput): Promise<InfluxQueryResult> {
        return await this.influxService.differenceBetweenFirstAndLast(data);
    }

    /**
     * Get last occurrence of value in field
     * @param data Input data and value to compare against
     * @param operator Operator to check with
     */
    @Post('lastOccurrenceOfValue/{operator}')
    public async lastOccurrenceOfValue(@Body() data: {input: InfluxQueryInput, value: {[key: string]: any}},
                                       @Path() operator: ComparisonOperator): Promise<InfluxQueryResult> {
        return await this.influxService.lastOccurrenceOfValue(data.input, operator, data.value);
    }

    /**
     * Run aggregation for each combination of start in starts and InfluxQueryInputParam.to
     * The InfluxQueryInputParam.from parameter is also used and should be same or before the earliest item of starts
     * @param data Input data and Array of dates to start from
     */
    @Post('parameterAggregationWithMultipleStarts')
    public async parameterAggregationWithMultipleStarts(@Body() data: {data: InfluxQueryInput, starts: string[]}): Promise<InfluxQueryResult> {
        return await this.influxService.parameterAggregationWithMultipleStarts(data.data, data.starts);
    }

    /**
     * Filter distinct value in data.sensors
     * @param isString if data field is string type
     * @param shouldCount should be only counted and not returned
     * @param body Input data and value mapping
     */
    @Post('filterDistinctValue')
    public async filterDistinctValue(@Query() isString: boolean,
                                     @Query() shouldCount: boolean,
                                     @Body() body: {data: InfluxQueryInput, values: SingleSimpleValue[]}): Promise<InfluxQueryResult> {
        return await this.influxService.filterDistinctValue(body.data, isString, shouldCount, body.values);
    }
}

export {StatisticsController};
