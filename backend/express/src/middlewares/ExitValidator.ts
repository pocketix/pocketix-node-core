import {validationResult} from 'express-validator';
import {Request, Response, NextFunction} from 'express';
import {FieldErrors, ValidateError} from '@tsoa/runtime';

/**
 * Convert 'express-validator' errors to 'tsoa' errors and exit from middleware stack
 */
class ExitValidator {
    public static onErrors = (request: Request, response: Response, next: NextFunction) => {
        const errors = validationResult(request);

        // Convert express-validator errors to tsoa errors
        if (!errors.isEmpty()) {
            const fields: FieldErrors = errors.array().reduce(
                (convertedErrors, item) => {
                    convertedErrors[item.param] = ({value: item.value, message: item.msg});
                    return convertedErrors;
                }, {}
            );

            throw new ValidateError(fields, 'message');
        }

        next();
    }
}

export {ExitValidator};
