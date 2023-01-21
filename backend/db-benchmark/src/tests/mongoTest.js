import {
	createCollection, dropCollection, executeAggregation as mongoAggregation, executeQuery as mongoQuery,
	init as mongoInit,
	insertMany as insertManyMongo, insertOne as insertOneMongo,
	selectCollection as mongoCollection
} from "../databases/mongo.js";
import {performance} from "perf_hooks";
import {
    mongoAggregateAvg,
    mongoAggregateAvg30Days,
    mongoAggregateAvg60Days, mongoAggregateAvgTemperature,
    mongoAll,
    mongoSingle
} from "../databases/queries.js";
import {countTimers, countTimersTemp} from "../helpers.js";

const commonMongo = async (database, collection, documents, one, series, port) => {
	const mongo = mongoInit(port);
	const start = performance.now();
	await createCollection({name: collection, database, client: mongo, series});
	const settings = {client: mongo, collection: mongoCollection(mongo, database, collection)};
	const create = performance.now();
	await insertManyMongo({documents, ...settings});
	const seed = performance.now();
	await mongoQuery({query: mongoSingle({}), ...settings});
	const single = performance.now();
	await mongoQuery({query: mongoAll({}), ...settings});
	const all = performance.now();
    const query = mongoAggregateAvg30Days({minutes: 15});
    await mongoAggregation({query: mongoAggregateAvg({minutes: 15}), ...settings});
    const avg = performance.now();
    await mongoAggregation({query: mongoAggregateAvg30Days({minutes: 15}), ...settings});
    const avg30 = performance.now();
    await mongoAggregation({query: mongoAggregateAvg60Days({minutes: 15}), ...settings});
    const avg60 = performance.now();
	await insertOneMongo({document: one, ...settings});
	const insert = performance.now();
	await dropCollection({name: collection, database, client: mongo});
	const del = performance.now();
    documents = null;
    return countTimers(start, create, seed, single, all, avg, avg30, avg60, insert, del);
}

const mongoTest = async (documents, one, port) => {
	return await commonMongo("boiler", "boilerSpeedTest", documents, one, false, port);
}

const mongoSeriesTest = async (documents, one, port) => {
	return await commonMongo("boiler_series", "boilerSpeedTest", documents, one, true, port);
}

const mongoTestTemperatureCommon = async (database, collection, documents, one, series, port) => {
    const mongo = mongoInit(port);
    const start = performance.now();
    await createCollection({name: collection, database, client: mongo, series});
    const settings = {client: mongo, collection: mongoCollection(mongo, database, collection)};
    const create = performance.now();
    await insertManyMongo({documents, ...settings});
    const seed = performance.now();
    await mongoAggregation({
        query: mongoAggregateAvgTemperature({
            start: "2022-12-06T03:19:38Z",
            stop: "2023-01-06T03:19:38Z",
            sensor: "8CF95740000031E0",
            minutes: 15
        }), ...settings
    });
    const avg30 = performance.now();
    await mongoAggregation({
        query: mongoAggregateAvg60Days({
            start: "2022-11-06T03:19:38Z",
            stop: "2023-01-06T03:19:38Z",
            sensor: "8CF95740000031E0",
            minutes: 15
        }), ...settings
    });
    const avg60 = performance.now();
    await mongoAggregation({
        query: mongoAggregateAvgTemperature({
            start: "2022-09-06T03:19:38Z",
            stop: "2022-10-06T03:19:38Z",
            sensor: "8CF95740000031E0",
            minutes: 60
        }), ...settings
    });
    const avg30daysBefore120days = performance.now();
    await mongoAggregation({
        query: mongoAggregateAvg60Days({
            start: "2022-09-06T03:19:38Z",
            stop: "2023-01-06T03:19:38Z",
            sensor: "8CF95740000031E0",
            minutes: 60
        }), ...settings
    });
    const avg120 = performance.now();
    await dropCollection({name: collection, database, client: mongo});
    const del = performance.now();
    documents = null;
    return countTimersTemp(start, create, seed, avg30, avg60, avg30daysBefore120days, avg120, del);
}

const mongoTestTemp = async (documents, one, port) => {
    return await mongoTestTemperatureCommon("boiler", "boilerSpeedTest", documents, one, false, port);
}

const mongoSeriesTestTemp = async (documents, one, port) => {
    return await mongoTestTemperatureCommon("boiler_series", "boilerSpeedTest", documents, one, true, port);
}

export {mongoTest, mongoSeriesTest, mongoTestTemp, mongoSeriesTestTemp};
