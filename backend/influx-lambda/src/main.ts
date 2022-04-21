import {
    APIGatewayEventDefaultAuthorizerContext,
    APIGatewayProxyEventBase,
    APIGatewayProxyHandler,
    Context
} from 'aws-lambda';
import all from "./swagger.json";
import OpenAPIRequestValidator from 'openapi-request-validator';
import OpenapiRequestCoercer from 'openapi-request-coercer';

import {IJsonSchema} from "openapi-types";

const createValidator = (path: string) => new OpenAPIRequestValidator({
    schemas: all.components.schemas as unknown as IJsonSchema[],
    requestBody: all.paths[path].post.requestBody,
    parameters: all.paths[path].post.parameters
});

const createCoercer = (path: string) => new OpenapiRequestCoercer({
    parameters: all.paths[path].post.parameters
});

type Request = {
    headers: { [key: string]: string | undefined },
    body: any,
    query: { [key: string]: string | undefined },
    params: { [key: string]: string | undefined }
}

const eventToRequest = (event: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>): Request => {
    const headers = event.headers || {};
    return {
        headers: Object.fromEntries(Object.entries(headers).map(([header, value]) => [header.toLowerCase(), value])),
        body: JSON.parse(event.body || ""),
        query: event.queryStringParameters || {},
        params: event.pathParameters || {}
    };
}

// Default headers
const headers = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST"
};

import {IInflux} from "../../InfluxDataBase/api/IInflux"
import {Influx} from "../../InfluxDataBase/api/Influx";
import {
    SingleSimpleValue,
    ComparisonOperator,
    InfluxQueryInput
} from "../../InfluxDataBase/api/influxTypes";

import {WriteRequestBody} from "./generated/models/write-request-body";

const influx: IInflux = new Influx(
    process.env.URL || "",
    process.env.ORG || "",
    process.env.TOKEN || "",
    process.env.BUCKET || ""
);

/**
 * Simplify the creation of a response
 * @param results action results
 * @param code code override
 */
const createResponse = (results, code = 400) => {
    return {
        statusCode: results.status === 0 ? 200 : code,
        headers,
        body: JSON.stringify(results.status === 0
            ? {data: results.data}
            : {error: results.error}
        )
    };
};

/**
 * Check HTTP method, convert request from AWS dependent to Request validate body of the request.
 * Also disables callbackWaitsForEmptyEventLoop
 * If either method or body is invalid returns the error as a Truthy value
 * Else returns Falsy value
 * @param event input request as AWS event
 * @param context current context
 * @param path url path
 * @param methods allowed HTTP methods (in uppercase)
 */
const lambdaEntry = (event: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>,
                                      context: Context,
                                      path: string,
                                      methods: string[] = ["POST"]): Request => {
    context.callbackWaitsForEmptyEventLoop = false;
    // Check the http method and return unsupported method if invalid
    if (!methods.includes(event.httpMethod.toUpperCase())) {
        throw createResponse({status: -1, error: "Unsupported method"}, 405);
    }

    const coercer = createCoercer(path);
    const validator = createValidator(path);
    const request = eventToRequest(event);
    coercer.coerce(request);
    const errors = validator.validateRequest(request);
    console.log(errors);

    if (errors)
        throw errors;

    return request;
}

/**
 * Get raw statistics from Influx
 */
export const statistics: APIGatewayProxyHandler = async (event, context) => {
    let request;
    try {
        request = lambdaEntry(event, context, "/statistics");
    } catch (e) {
        createResponse(e);
    }

    const input = {
        operation: "",
        bucket: request.body.bucket,
        param: {
            sensors: request.body.sensors,
            from: request.query.from || undefined,
            to: request.query.to || undefined,
            timezone: request.body.timezone || undefined
        }
    } as InfluxQueryInput

    const results = await influx.queryApi(input);
    return createResponse(results);
}

/**
 * Get aggregated statistics from Influx
 */
export const aggregate: APIGatewayProxyHandler = async (event, context) => {
    let request;
    try {
        request = lambdaEntry(event, context, "/statistics/aggregate/{operation}");
    } catch (e) {
        createResponse(e);
    }

    const input = {
        operation: request.params.operation || "mean",
        bucket: request.body.bucket,
        param: {
            sensors: request.body.sensors,
            from: request.query.from || undefined,
            to: request.query.to || undefined,
            timezone: request.body.timezone || undefined,
            aggregateMinutes: request.query.aggregateMinutes || undefined
        }
    } as InfluxQueryInput

    const results = await influx.queryApi(input);
    return createResponse(results);
}

export const differenceBetweenFirstAndLast: APIGatewayProxyHandler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const request = JSON.parse(JSON.stringify(event));
    const body = JSON.parse(request.body);
    const results = await influx.differenceBetweenFirstAndLast(body);

    return createResponse(results);
}

export const lastOccurenceOfValue: APIGatewayProxyHandler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const json = JSON.parse(JSON.stringify(event));
    const operator = json.pathParameters?.operator as ComparisonOperator;
    const requestBody = JSON.parse(json.body);

    const results = await influx.lastOccurrenceOfValue(requestBody.input, operator, requestBody.value);

    return createResponse(results);
}

export const parameterAggregationWithMultipleStarts: APIGatewayProxyHandler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const json = JSON.parse(JSON.stringify(event));
    const requestBody = JSON.parse(json.body);

    const results = await influx.parameterAggregationWithMultipleStarts(requestBody.data, requestBody.starts);

    return createResponse(results)
}

export const filterDistinctValue: APIGatewayProxyHandler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const requestBody = JSON.parse(JSON.parse(JSON.stringify(event)).body) as { data: InfluxQueryInput, values: SingleSimpleValue[] };
    const isString = event.pathParameters?.isString === "true" || false;
    const shouldCount = event.pathParameters?.shouldCount === "true" || false;

    const results = await influx.filterDistinctValue(requestBody.data, isString, shouldCount, requestBody.values);

    return createResponse(results)
}

/**
 * Save data to Influx
 */
export const saveData: APIGatewayProxyHandler = async (event, context) => {
    if (event.httpMethod.toLowerCase() !== 'post')
        return createResponse({status: -1, error: "Unsupported method"}, 405)

    context.callbackWaitsForEmptyEventLoop = false;

    const body = JSON.parse(JSON.stringify(event.body)) as WriteRequestBody;

    const results = await influx.saveData(body.data, body.bucket);
    return createResponse(results);
}
