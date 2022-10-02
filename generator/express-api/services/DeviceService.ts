/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Device } from '../models/Device';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DeviceService {

    /**
     * Get device by deviceUid
     * @param deviceUid deviceUid to search by
     * @returns Device Ok
     * @throws ApiError
     */
    public static getDeviceById(
deviceUid: string,
): CancelablePromise<Device> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/devices/{deviceUid}',
            path: {
                'deviceUid': deviceUid,
            },
        });
    }

    /**
     * Get all devices
     * @returns Device Ok
     * @throws ApiError
     */
    public static getAllDevices(): CancelablePromise<Array<Device>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/devices',
        });
    }

    /**
     * Get devices by specific type
     * @param deviceType type to filter by
     * @returns Device Ok
     * @throws ApiError
     */
    public static getDevicesByDeviceType(
deviceType: string,
): CancelablePromise<Array<Device>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/devices/byType/{deviceType}',
            path: {
                'deviceType': deviceType,
            },
        });
    }

}
