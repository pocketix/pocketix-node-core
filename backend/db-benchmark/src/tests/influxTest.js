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
    influxAggregateAvg, influxAggregateAvgTemperature,
    influxAll,
    influxSingle
} from "../databases/queries.js";
import {countTimers, countTimersTemp} from "../helpers.js";

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

const influxTestTemperature = async (data) => {
    const bucket = 'boilerSpeedTest';
    const influx = influxInit();
    const start = performance.now();
    await createBucket({name: bucket, client: influx});
    const create = performance.now();
    await insertManyInflux({data, client: influx});
    const seed = performance.now();
    await influxQuery({query: influxAggregateAvgTemperature({
            start: "2022-12-06T03:19:38Z",
            stop: "2023-01-06T03:19:38Z",
            sensor: "8CF95740000031E0",
            minutes: 15,
            bucket
        }), client: influx});
    const avg30 = performance.now();
    await influxQuery({query: influxAggregateAvgTemperature({
            start: "2022-11-06T03:19:38Z",
            stop: "2023-01-06T03:19:38Z",
            sensor: "8CF95740000031E0",
            minutes: 15,
            bucket
        }), client: influx});
    const avg60 = performance.now();
    await influxQuery({query: influxAggregateAvgTemperature({
            start: "2022-09-06T03:19:38Z",
            stop: "2022-10-06T03:19:38Z",
            sensor: "8CF95740000031E0",
            minutes: 60,
            bucket
        }), client: influx});
    const avg30daysBefore120days = performance.now();
    await influxQuery({query: influxAggregateAvgTemperature({
            start: "2022-09-06T03:19:38Z",
            stop: "2023-01-06T03:19:38Z",
            sensor: "8CF95740000031E0",
            minutes: 60,
            bucket
        }), client: influx});
    const avg120 = performance.now();
    await deleteBucket({name: bucket, client: influx});
    const del = performance.now();
    return countTimersTemp(start, create, seed, avg30, avg60, avg30daysBefore120days, avg120, del);
}

export {influxTest, influxTestTemperature};
