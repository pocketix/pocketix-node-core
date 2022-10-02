/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ComparisonOperator } from '../models/ComparisonOperator';
import type { InfluxQueryInput } from '../models/InfluxQueryInput';
import type { InfluxQueryResult } from '../models/InfluxQueryResult';
import type { Operation } from '../models/Operation';
import type { ReadRequestBody } from '../models/ReadRequestBody';
import type { SingleSimpleValue } from '../models/SingleSimpleValue';
import type { WriteRequestBody } from '../models/WriteRequestBody';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ApiService {

    /**
     * Get not aggregated data from sensors. May be between two dates (from and to).
 * The dates could be either both undefined or both defined
     * @param requestBody The body of the request
     * @param from The start of the time window
     * @param to The end of the time window
     * @returns InfluxQueryResult Ok
     * @throws ApiError
     */
    public static statistics(
requestBody: ReadRequestBody,
from?: string,
to?: string,
): CancelablePromise<InfluxQueryResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/statistics',
            query: {
                'from': from,
                'to': to,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get aggregated data from sensors. May be between two dates (from and to).
 * The dates could be either both undefined or both defined. Custom granularity can be set by using aggregateMinutes
     * @param operation The aggregation operation to execute.
     * @param requestBody The body of the request
     * @param aggregateMinutes The amount of time (in minutes) that should be aggregated into one sample
     * @param from The start of the time window
     * @param to The end of the time window
     * @returns InfluxQueryResult Ok
     * @throws ApiError
     */
    public static aggregate(
operation: Operation,
requestBody: ReadRequestBody,
aggregateMinutes: number = 10,
from?: string,
to?: string,
): CancelablePromise<InfluxQueryResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/statistics/aggregate/{operation}',
            path: {
                'operation': operation,
            },
            query: {
                'aggregateMinutes': aggregateMinutes,
                'from': from,
                'to': to,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Save data to InfluxDB
     * @param requestBody request body
     * @returns any Created
     * @throws ApiError
     */
    public static saveData(
requestBody: WriteRequestBody,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/statistics/data',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get difference between first and last item value of selected items
     * @param requestBody settings
     * @returns InfluxQueryResult Ok
     * @throws ApiError
     */
    public static differenceBetweenFirstAndLast(
requestBody: InfluxQueryInput,
): CancelablePromise<InfluxQueryResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/statistics/differenceBetweenFirstAndLast',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get last occurrence of value in field
     * @param operator Operator to check with
     * @param requestBody Input data and value to compare against
     * @returns InfluxQueryResult Ok
     * @throws ApiError
     */
    public static lastOccurrenceOfValue(
operator: ComparisonOperator,
requestBody: {
value: Record<string, any>;
input: InfluxQueryInput;
},
): CancelablePromise<InfluxQueryResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/statistics/lastOccurrenceOfValue/{operator}',
            path: {
                'operator': operator,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Run aggregation for each combination of start in starts and InfluxQueryInputParam.to
 * The InfluxQueryInputParam.from parameter is also used and should be same or before the earliest item of starts
     * @param requestBody Input data and Array of dates to start from
     * @returns InfluxQueryResult Ok
     * @throws ApiError
     */
    public static parameterAggregationWithMultipleStarts(
requestBody: {
starts: Array<string>;
data: InfluxQueryInput;
},
): CancelablePromise<InfluxQueryResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/statistics/parameterAggregationWithMultipleStarts',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Filter distinct value in data.sensors
     * @param isString if data field is string type
     * @param shouldCount should be only counted and not returned
     * @param requestBody Input data and value mapping
     * @returns InfluxQueryResult Ok
     * @throws ApiError
     */
    public static filterDistinctValue(
isString: boolean,
shouldCount: boolean,
requestBody: {
values: Array<SingleSimpleValue>;
data: InfluxQueryInput;
},
): CancelablePromise<InfluxQueryResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/statistics/filterDistinctValue',
            query: {
                'isString': isString,
                'shouldCount': shouldCount,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
