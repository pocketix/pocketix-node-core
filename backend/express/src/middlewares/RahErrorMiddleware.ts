import {ApiError} from '../utility/ApiError';
import {NextFunction, Request, Response} from 'express';

class RahErrorMiddleware {
    public static lazy(error: any, request: Request, response: Response, next: NextFunction) {
        throw new ApiError('Exception', 400, `Exception ${error}`);
    }
}

export {RahErrorMiddleware};
