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

import { Device } from '../models/device';

@Injectable({
  providedIn: 'root',
})
export class DeviceService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getDeviceById
   */
  static readonly GetDeviceByIdPath = '/devices/{deviceUid}';

  /**
   * Get device by deviceUid
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getDeviceById()` instead.
   *
   * This method doesn't expect any request body.
   */
  getDeviceById$Response(params: {

    /**
     * deviceUid to search by
     */
    deviceUid: string;
  }): Observable<StrictHttpResponse<Device>> {

    const rb = new RequestBuilder(this.rootUrl, DeviceService.GetDeviceByIdPath, 'get');
    if (params) {
      rb.path('deviceUid', params.deviceUid, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Device>;
      })
    );
  }

  /**
   * Get device by deviceUid
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getDeviceById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getDeviceById(params: {

    /**
     * deviceUid to search by
     */
    deviceUid: string;
  }): Observable<Device> {

    return this.getDeviceById$Response(params).pipe(
      map((r: StrictHttpResponse<Device>) => r.body as Device)
    );
  }

  /**
   * Path part for operation getAllDevices
   */
  static readonly GetAllDevicesPath = '/devices';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllDevices()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllDevices$Response(params?: {
  }): Observable<StrictHttpResponse<Array<Device>>> {

    const rb = new RequestBuilder(this.rootUrl, DeviceService.GetAllDevicesPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<Device>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getAllDevices$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllDevices(params?: {
  }): Observable<Array<Device>> {

    return this.getAllDevices$Response(params).pipe(
      map((r: StrictHttpResponse<Array<Device>>) => r.body as Array<Device>)
    );
  }

}
