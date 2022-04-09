import {APIGatewayProxyHandler} from 'aws-lambda';
import {Influx} from '../api/Influx';
import {Sensors} from '../api/influxTypes';


export const handler: APIGatewayProxyHandler = async (event) => {
    let body;
    let statusCode = 200;
    const headers = {
        'Content-Type': 'application/json'
    };

    const url = '';
    const org = '';
    const token = '';
    const bucket = '';

    const influx = new Influx(url, org, token, bucket);

    try {
        switch (event.httpMethod) {
            case 'PUT':
            case 'POST':
                const data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
                await influx.saveData([data]);
                break;
            case 'GET':
                const start = event?.queryStringParameters?.start;
                const stop = event?.queryStringParameters?.stop;
                const sensors = event?.queryStringParameters?.sensors as unknown as Sensors;
                const aggregateMinutes = event?.queryStringParameters?.minutes;
                const convertedMinutes = typeof aggregateMinutes === 'string' ? parseInt(aggregateMinutes, 10) : undefined;
                body = await influx.query(sensors, start, stop, convertedMinutes);
                break;
            default:
                throw new Error(`Unsupported route: "${event.httpMethod}"`);
        }
    } catch (err: any) {
        statusCode = 400;
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers
    };
};
