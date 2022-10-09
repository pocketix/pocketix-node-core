import {InfluxService} from '../services/InfluxService';
import {Inject, Service, Container} from 'typedi';
import {
    Body,
    Controller,
    Middlewares,
    Post,
    Query,
    Route,
    SuccessResponse,
    Request,
    Path,
    Tags
} from 'tsoa';

import {
    ComparisonOperator,
    InfluxQueryInput,
    InfluxQueryInputParam,
    InfluxQueryResult,
    Operation, SingleSimpleValue
} from '../../../InfluxDataBase/api/influxTypes';
import {fromDateBeforeToDate} from '../validators/fromDateBeforeToDate';
import {ExitValidator} from '../middlewares/ExitValidator';
import {Request as ExpressRequest} from 'express';
import {createBucketName} from '../utility/createBucketName';
import {ReadRequestBody} from '../types/ReadRequestBody';
import {WriteRequestBody} from '../types/WriteRequestBody';
import {DeviceService} from "../services/DeviceService";
import {MongoService} from "../services/MongoService";
import {performance, PerformanceObserver} from "perf_hooks";


@Service()
@Route('statistics')
@Tags('Influx', 'Api')
class StatisticsController extends Controller {
    @Inject()
    private influxService: InfluxService;
    @Inject()
    private deviceService: DeviceService;
    @Inject()
    private mongoService: MongoService;
    private performanceObserver: PerformanceObserver;

    constructor() {
        super();
        this.influxService = Container.get(InfluxService);
        this.performanceObserver = new PerformanceObserver((items) => {
            items.getEntries().forEach((entry => {
                console.log(entry);
            }));
        });

        this.performanceObserver.observe({entryTypes: ["measure"], buffered: true})
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
        performance.mark("statistics-influx-start");
        const influxResult = await this.influxService.statistics(influxQuery)
        performance.mark("statistics-influx-end");
        performance.mark("statistics-mongo-start");
        const mongoResult = await this.mongoService.statistics(influxQuery);
        performance.mark("statistics-mongo-end");

        performance.measure("statistics-influx", "statistics-influx-start", "statistics-influx-end");
        performance.measure("statistics-mongo", "statistics-mongo-start", "statistics-mongo-end");
        return influxResult;
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
        performance.mark("aggregate-influx-start");
        const influxResult = await this.influxService.average(influxQuery);
        performance.mark("aggregate-influx-end");
        performance.mark("aggregate-mongo-start");
        const mongoResult = await this.mongoService.average(influxQuery);
        performance.mark("aggregate-mongo-end");

        performance.measure("aggregate-influx", "aggregate-influx-start", "aggregate-influx-end");
        performance.measure("aggregate-mongo", "aggregate-mongo-start", "aggregate-mongo-end");
        return influxResult;
    }

    /**
     * Save data to InfluxDB
     * @param body request body
     */
    @Post('data')
    @SuccessResponse('201', 'Created')
    public async saveData(@Body() body: WriteRequestBody): Promise<void> {
        performance.mark("save-influx-start");
        await this.influxService.saveData(body.data, body.bucket);
        performance.mark("save-influx-stop");
        performance.mark("save-mongo-start");
        await this.mongoService.saveData(body.data, body.bucket);
        performance.mark("save-mongo-stop");
        performance.mark("save-sqlUpdate-start");
        await this.deviceService.updateDeviceIfExists(body.data[body.data.length - 1]);
        performance.mark("save-sqlUpdate-stop");

        performance.measure("save-influx", "save-influx-start", "save-influx-end");
        performance.measure("save-mongo", "save-mongo-start", "save-mongo-end");
        performance.measure("save-sqlUpdate", "save-sqlUpdate-start", "save-sqlUpdate-end");
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
