import {Container} from 'typedi';
import {InfluxService} from '../services/InfluxService';
import {NextFunction, Request, Response} from 'express';
import {InputData} from '../../../InfluxDataBase/api/influxTypes';
import {Ipware, IpwareCallOptions, IpwareIpInfo} from '@fullerstack/nax-ipware';

/**
 * Logs errors and requests and saves them to the InfluxDB
 */
class LoggingMiddleware {

    constructor() {
        this.influxService = Container.get(InfluxService);
        const ip = new Ipware();
        this.getClientIp = ip.getClientIP;
    }
    private influxService: InfluxService;
    private readonly getClientIp: (request: any, callOptions?: IpwareCallOptions) => IpwareIpInfo;

    /**
     * If logging fails log to console
     * @param error insertion error
     * @param data data to log
     */
    private static influxError(error: string, data: string): void {
        console.warn(error);
        console.warn(data);
    }

    /**
     * Get IP from request
     * @param request client request
     */
    private getIpOrError(request): string {
        let source: string;

        // Try to get the IP if possible
        try {
            source = this.getClientIp(request).ip;
        }
        catch (e) {
            source = JSON.stringify(e);
        }

        return source;
    }

    /**
     * Gets data for error from request
     * @param request client request
     */
    private getErrorDataFromRequest(request: Request): object {
        const source = this.getIpOrError(request);

        return {
            headers: request.rawHeaders,
            url: request.url,
            endpoint: request.path,
            query: request.query,
            params: request.params,
            body: request.body,
            source
        };
    }

    /**
     * Log errors to Influx
     * @param error error to log
     * @param request incoming request
     * @param response server response
     * @param next next error handler
     */
    public async logErrors(error: unknown, request: Request, response: Response, next: NextFunction): Promise<void | Response> {
        const data = {
            deviceUid: 'app',
            tst: new Date(),
            error,
            ...this.getErrorDataFromRequest(request)
        } as InputData;

        try {
            await this.influxService.logError(data);
        } catch (e) {
            LoggingMiddleware.influxError(e, JSON.stringify(data));
        }

        // Pass error to the next middleware
        next(error);
    }

    /**
     * Log all incoming requests
     * @param request request to log
     * @param response server response
     * @param next middleware
     */
    public async logRequests(request: Request, response: Response, next: NextFunction): Promise<void> {
        const data = {
            deviceUid: 'app',
            tst: new Date(),
            method: request.method,
            url: request.originalUrl
        } as InputData;

        try {
            await this.influxService.logRequest(data);
        }
        catch (e){
            LoggingMiddleware.influxError(e, JSON.stringify(data));
        }

        // Pass data to next middleware
        next();
    }
}

export {LoggingMiddleware};
