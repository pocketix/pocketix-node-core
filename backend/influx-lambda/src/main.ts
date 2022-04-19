import {APIGatewayEventDefaultAuthorizerContext, APIGatewayProxyEventBase, APIGatewayProxyHandler} from 'aws-lambda';



// Default headers
const headers = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST"
};

// Validation
import Ajv, {JSONSchemaType, ValidateFunction} from "ajv";

// This in fact does not require allowSyntheticDefaultImports to work.
// Webpack packs the JSON data directly into the output file and adds default export.
// The allowSyntheticDefaultImports flag is set to true just to avoid IDE errors.
import all from "./Api.json";
import {IInflux} from "influx-aws-lambda/api/IInflux";
import {Influx} from "influx-aws-lambda/api/Influx";
import {ReadRequestBody, Operation, WriteRequestBody, ComparisonOperator, InfluxQueryInput} from "../../../frontend/src/app/generated/models";
import {SingleSimpleValue} from "influx-aws-lambda/api/influxTypes";

const influx: IInflux = new Influx(
    process.env.URL || "",
    process.env.ORG || "",
    process.env.TOKEN || "",
    process.env.BUCKET || ""
);

/**
 * Get schema from common JSON definition file
 * @param schema schema to read from
 * @param target schema to get
 */
const getFromAllJsonSchemaAsType = <T>(schema, target) => {
    return schema.definitions[target] as unknown as JSONSchemaType<T>
}

// Global instance of the validator
const ajv = new Ajv({allErrors: true});
// Register all schemas
const allSchemas = ajv.addSchema(all);
// Compile schemas one by one and create
const allRequestBodySchema: JSONSchemaType<ReadRequestBody> = getFromAllJsonSchemaAsType(all, "ReadRequestBody");
const readRequestBodyValidator = allSchemas.compile<ReadRequestBody>(allRequestBodySchema);

/**
 * Convert incoming request
 * @param event event containing the request
 */
const convertRequest = (event) => {
    const json = JSON.parse(JSON.stringify(event));
    const body: ReadRequestBody = JSON.parse(json.body);
    const bucket = body.bucket;

    return {
        param: {
            sensors: body.sensors,
            from: json?.queryStringParameters?.from || undefined,
            to: json?.queryStringParameters?.to || undefined,
            aggregateMinutes: parseInt(json?.queryStringParameters?.aggregateMinutes, 10) || undefined,
            timezone: body.timezone || undefined
        },
        bucket: bucket,
        operation: Operation._
    };
};

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
 * Check HTTP method and validate body of the request.
 * If either method or body is invalid returns the error as a Truthy value
 * Else returns Falsy value
 * @param event input request as AWS event
 * @param methods allowed HTTP methods (in uppercase)
 * @param validator ajv validator to run on body
 */
const isNotValidMethodAndValidBody = (event: APIGatewayProxyEventBase<APIGatewayEventDefaultAuthorizerContext>,
                                validator: ValidateFunction,
                                methods: string[] = ["POST"]) => {
    // Check the http method and return unsupported method if invalid
    if (!methods.includes(event.httpMethod.toUpperCase())) {
        return createResponse({status: -1, error: "Unsupported method"}, 405);
    }

    if(!validator(JSON.parse(event.body as string))) {
        return createResponse({status: -1, error: validator.errors})
    }

    return false;
}

/**
 * Get raw statistics from Influx
 */
export const statistics: APIGatewayProxyHandler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const errorOrFalse = isNotValidMethodAndValidBody(event, readRequestBodyValidator)

    if (errorOrFalse)
        return errorOrFalse;

    const request = convertRequest(event);

    // This endpoint does not accept aggregation
    request.param.aggregateMinutes = undefined;

    const results = await influx.queryApi(request);
    return createResponse(results);
}

/**
 * Get aggregated statistics from Influx
 */
export const aggregate: APIGatewayProxyHandler = async (event, context) => {
    if (event.httpMethod.toLowerCase() !== 'post')
        return createResponse({status: -1, error: "Unsupported method"}, 405)

    const operation = event.pathParameters?.operation;
    context.callbackWaitsForEmptyEventLoop = false;
    const request = convertRequest(event);
    // @ts-ignore
    request.operation = operation;
    const results = await influx.queryApi(request);
    return createResponse(results);
}

export const differenceBetweenFirstAndLast: APIGatewayProxyHandler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const request = convertRequest(event);
    const results = await influx.differenceBetweenFirstAndLast(request);

    return createResponse(results)
}

export const lastOccurenceOfValue: APIGatewayProxyHandler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const operator = event.pathParameters?.operator as ComparisonOperator;
    const requestBody = JSON.parse(JSON.stringify(event)) as {value: {}, input: InfluxQueryInput};

    const results = await influx.lastOccurrenceOfValue(requestBody.input, operator, requestBody.value);

    return createResponse(results)
}

export const parameterAggregationWithMultipleStarts: APIGatewayProxyHandler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const requestBody = JSON.parse(JSON.stringify(event)) as {starts: [], input: InfluxQueryInput};

    const results = await influx.parameterAggregationWithMultipleStarts(requestBody.input, requestBody.starts);

    return createResponse(results)
}

export const filterDistinctValue: APIGatewayProxyHandler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const requestBody = JSON.parse(JSON.stringify(event)) as {data: InfluxQueryInput, values: SingleSimpleValue[]};
    const isString = event.pathParameters?.isString === "true";
    const shouldCount = event.pathParameters?.shouldCount === "true";

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
