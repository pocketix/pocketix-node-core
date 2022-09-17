import {
	createBucket, deleteBucket,
	executeQuery as influxQuery,
	init as influxInit,
	insertMany as insertManyInflux,
	insertOne as insertOneInflux
} from "../databases/influx.js";
import {performance} from "perf_hooks";
import {
    influxAggregate30Days,
    influxAggregate60Days,
    influxAggregateAvg,
    influxAll,
    influxSingle
} from "../databases/queries.js";
import {countTimers} from "../helpers.js";

const influxTest = async (data, one) => {
	const bucket = 'boilerSpeedTest';
	const influx = influxInit();
	const start = performance.now();
	await createBucket({name: bucket, client: influx});
	const create = performance.now();
	await insertManyInflux({data, client: influx});
	const seed = performance.now();
	await influxQuery({query: influxSingle({bucket}), client: influx});
	const single = performance.now();
	await influxQuery({query: influxAll({bucket}), client: influx});
	const all = performance.now();
    await influxQuery({query: influxAggregateAvg({bucket, minutes: 15}), client: influx});
    const avg = performance.now();
    await influxQuery({query: influxAggregate30Days({bucket, minutes: 15}), client: influx});
    const avg30 = performance.now();
    await influxQuery({query: influxAggregate60Days({bucket, minutes: 15}), client: influx});
    const avg60 = performance.now();
	await insertOneInflux({data: one, client: influx});
	const insert = performance.now();
	await deleteBucket({name: bucket, client: influx});
	const del = performance.now();
    return countTimers(start, create, seed, single, all, avg, avg30, avg60, insert, del);
}

export {influxTest};
