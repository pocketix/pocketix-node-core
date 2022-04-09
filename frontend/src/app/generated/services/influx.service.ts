/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { ComparisonOperator } from '../models/comparison-operator';
import { InfluxQueryInput } from '../models/influx-query-input';
import { InfluxQueryResult } from '../models/influx-query-result';
import { Operation } from '../models/operation';
import { ReadRequestBody } from '../models/read-request-body';
import { SingleSimpleValue } from '../models/single-simple-value';
import { WriteRequestBody } from '../models/write-request-body';

@Injectable({
  providedIn: 'root',
})
export class InfluxService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation statistics
   */
  static readonly StatisticsPath = '/statistics';

  /**
   * Get not aggregated data from sensors. May be between two dates (from and to).
   * The dates could be either both undefined or both defined
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `statistics()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  statistics$Response(params: {

    /**
     * The start of the time window
     */
    from?: string;

    /**
     * The end of the time window
     */
    to?: string;

    /**
     * The body of the request
     */
    body: ReadRequestBody
  }): Observable<StrictHttpResponse<InfluxQueryResult>> {

    const rb = new RequestBuilder(this.rootUrl, InfluxService.StatisticsPath, 'post');
    if (params) {
      rb.query('from', params.from, {});
      rb.query('to', params.to, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<InfluxQueryResult>;
      })
    );
  }

  /**
   * Get not aggregated data from sensors. May be between two dates (from and to).
   * The dates could be either both undefined or both defined
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `statistics$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  statistics(params: {

    /**
     * The start of the time window
     */
    from?: string;

    /**
     * The end of the time window
     */
    to?: string;

    /**
     * The body of the request
     */
    body: ReadRequestBody
  }): Observable<InfluxQueryResult> {

    return this.statistics$Response(params).pipe(
      map((r: StrictHttpResponse<InfluxQueryResult>) => r.body as InfluxQueryResult)
    );
  }

  /**
   * Path part for operation aggregate
   */
  static readonly AggregatePath = '/statistics/aggregate/{operation}';

  /**
   * Get aggregated data from sensors. May be between two dates (from and to).
   * The dates could be either both undefined or both defined. Custom granularity can be set by using aggregateMinutes
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `aggregate()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  aggregate$Response(params: {

    /**
     * The aggregation operation to execute.
     */
    operation: Operation;

    /**
     * The amount of time (in minutes) that should be aggregated into one sample
     */
    aggregateMinutes?: number;

    /**
     * The start of the time window
     */
    from?: string;

    /**
     * The end of the time window
     */
    to?: string;

    /**
     * The body of the request
     */
    body: ReadRequestBody
  }): Observable<StrictHttpResponse<InfluxQueryResult>> {

    const rb = new RequestBuilder(this.rootUrl, InfluxService.AggregatePath, 'post');
    if (params) {
      rb.path('operation', params.operation, {});
      rb.query('aggregateMinutes', params.aggregateMinutes, {});
      rb.query('from', params.from, {});
      rb.query('to', params.to, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<InfluxQueryResult>;
      })
    );
  }

  /**
   * Get aggregated data from sensors. May be between two dates (from and to).
   * The dates could be either both undefined or both defined. Custom granularity can be set by using aggregateMinutes
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `aggregate$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  aggregate(params: {

    /**
     * The aggregation operation to execute.
     */
    operation: Operation;

    /**
     * The amount of time (in minutes) that should be aggregated into one sample
     */
    aggregateMinutes?: number;

    /**
     * The start of the time window
     */
    from?: string;

    /**
     * The end of the time window
     */
    to?: string;

    /**
     * The body of the request
     */
    body: ReadRequestBody
  }): Observable<InfluxQueryResult> {

    return this.aggregate$Response(params).pipe(
      map((r: StrictHttpResponse<InfluxQueryResult>) => r.body as InfluxQueryResult)
    );
  }

  /**
   * Path part for operation saveData
   */
  static readonly SaveDataPath = '/statistics/data';

  /**
   * Save data to InfluxDB
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `saveData()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveData$Response(params: {

    /**
     * request body
     */
    body: WriteRequestBody
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, InfluxService.SaveDataPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * Save data to InfluxDB
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `saveData$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveData(params: {

    /**
     * request body
     */
    body: WriteRequestBody
  }): Observable<void> {

    return this.saveData$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation differenceBetweenFirstAndLast
   */
  static readonly DifferenceBetweenFirstAndLastPath = '/statistics/differenceBetweenFirstAndLast';

  /**
   * Get difference between first and last item value of selected items
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `differenceBetweenFirstAndLast()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  differenceBetweenFirstAndLast$Response(params: {

    /**
     * settings
     */
    body: InfluxQueryInput
  }): Observable<StrictHttpResponse<InfluxQueryResult>> {

    const rb = new RequestBuilder(this.rootUrl, InfluxService.DifferenceBetweenFirstAndLastPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<InfluxQueryResult>;
      })
    );
  }

  /**
   * Get difference between first and last item value of selected items
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `differenceBetweenFirstAndLast$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  differenceBetweenFirstAndLast(params: {

    /**
     * settings
     */
    body: InfluxQueryInput
  }): Observable<InfluxQueryResult> {

    return this.differenceBetweenFirstAndLast$Response(params).pipe(
      map((r: StrictHttpResponse<InfluxQueryResult>) => r.body as InfluxQueryResult)
    );
  }

  /**
   * Path part for operation lastOccurrenceOfValue
   */
  static readonly LastOccurrenceOfValuePath = '/statistics/lastOccurrenceOfValue/{operator}';

  /**
   * Get last occurrence of value in field
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `lastOccurrenceOfValue()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  lastOccurrenceOfValue$Response(params: {

    /**
     * Operator to check with
     */
    operator: ComparisonOperator;

    /**
     * Input data and value to compare against
     */
    body: {
'value': {
[key: string]: any;
};
'input': InfluxQueryInput;
}
  }): Observable<StrictHttpResponse<InfluxQueryResult>> {

    const rb = new RequestBuilder(this.rootUrl, InfluxService.LastOccurrenceOfValuePath, 'post');
    if (params) {
      rb.path('operator', params.operator, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<InfluxQueryResult>;
      })
    );
  }

  /**
   * Get last occurrence of value in field
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `lastOccurrenceOfValue$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  lastOccurrenceOfValue(params: {

    /**
     * Operator to check with
     */
    operator: ComparisonOperator;

    /**
     * Input data and value to compare against
     */
    body: {
'value': {
[key: string]: any;
};
'input': InfluxQueryInput;
}
  }): Observable<InfluxQueryResult> {

    return this.lastOccurrenceOfValue$Response(params).pipe(
      map((r: StrictHttpResponse<InfluxQueryResult>) => r.body as InfluxQueryResult)
    );
  }

  /**
   * Path part for operation parameterAggregationWithMultipleStarts
   */
  static readonly ParameterAggregationWithMultipleStartsPath = '/statistics/parameterAggregationWithMultipleStarts';

  /**
   * Run aggregation for each combination of start in starts and InfluxQueryInputParam.to
   * The InfluxQueryInputParam.from parameter is also used and should be same or before the earliest item of starts
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `parameterAggregationWithMultipleStarts()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  parameterAggregationWithMultipleStarts$Response(params: {

    /**
     * Input data and Array of dates to start from
     */
    body: {
'starts': Array<string>;
'data': InfluxQueryInput;
}
  }): Observable<StrictHttpResponse<InfluxQueryResult>> {

    const rb = new RequestBuilder(this.rootUrl, InfluxService.ParameterAggregationWithMultipleStartsPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<InfluxQueryResult>;
      })
    );
  }

  /**
   * Run aggregation for each combination of start in starts and InfluxQueryInputParam.to
   * The InfluxQueryInputParam.from parameter is also used and should be same or before the earliest item of starts
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `parameterAggregationWithMultipleStarts$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  parameterAggregationWithMultipleStarts(params: {

    /**
     * Input data and Array of dates to start from
     */
    body: {
'starts': Array<string>;
'data': InfluxQueryInput;
}
  }): Observable<InfluxQueryResult> {

    return this.parameterAggregationWithMultipleStarts$Response(params).pipe(
      map((r: StrictHttpResponse<InfluxQueryResult>) => r.body as InfluxQueryResult)
    );
  }

  /**
   * Path part for operation filterDistinctValue
   */
  static readonly FilterDistinctValuePath = '/statistics/filterDistinctValue';

  /**
   * Filter distinct value in data.sensors
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `filterDistinctValue()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  filterDistinctValue$Response(params: {

    /**
     * if data field is string type
     */
    isString: boolean;

    /**
     * should be only counted and not returned
     */
    shouldCount: boolean;
    body: {

/**
 * Input data
 */
'data': InfluxQueryInput;

/**
 * field values and their mapping
 */
'values': Array<SingleSimpleValue>;
}
  }): Observable<StrictHttpResponse<InfluxQueryResult>> {

    const rb = new RequestBuilder(this.rootUrl, InfluxService.FilterDistinctValuePath, 'post');
    if (params) {
      rb.query('isString', params.isString, {});
      rb.query('shouldCount', params.shouldCount, {});
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<InfluxQueryResult>;
      })
    );
  }

  /**
   * Filter distinct value in data.sensors
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `filterDistinctValue$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  filterDistinctValue(params: {

    /**
     * if data field is string type
     */
    isString: boolean;

    /**
     * should be only counted and not returned
     */
    shouldCount: boolean;
    body: {

/**
 * Input data
 */
'data': InfluxQueryInput;

/**
 * field values and their mapping
 */
'values': Array<SingleSimpleValue>;
}
  }): Observable<InfluxQueryResult> {

    return this.filterDistinctValue$Response(params).pipe(
      map((r: StrictHttpResponse<InfluxQueryResult>) => r.body as InfluxQueryResult)
    );
  }

}
