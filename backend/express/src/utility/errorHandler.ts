import {Request, Response, NextFunction} from 'express';
import {ValidateError} from '@tsoa/runtime';

type VoidableResponse = Response | void;

/**
 * Handle automatic tsoa validation errors
 * @param error error that occurred
 * @param request incoming request
 * @param response response to request
 * @param next next middleware or a controller
 */
const errorHandler = (error: unknown, request: Request, response: Response, next: NextFunction): VoidableResponse => {
    if (error instanceof ValidateError) {
        return response.status(422).json({
            message: 'Validation errors',
            details: error?.fields
        });
    }

    if (error instanceof Error) {
        return response.status(500).json({message: 'Internal Error'});
    }

    // Pass error to next middleware. There should not be one as this should be the lass middleware in the stack.
    next(error);
};

export {errorHandler};
