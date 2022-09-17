import {
	aggregation,
	createDb,
	executeScan as dynamoScan,
	init as dynamoInit,
	insertMany as insertManyDynamo, insertOne as insertOneDynamo, removeDb
} from "../databases/dynamo.js";
import {performance} from "perf_hooks";
import {dynamoAll, dynamoAll30Days, dynamoAll60Days, dynamoSingle} from "../databases/queries.js";
import {countTimers} from "../helpers.js";

const dbName = 'boilerSpeedTest'

const dynamoTest = async (document, one) => {
	const client = await dynamoInit();
	const start = performance.now();
	const tableResult = createDb(client);
	const table = {table: dbName};
	await client.waitFor('tableExists', {TableName: dbName}).promise();
	const create = performance.now();
	await insertManyDynamo({document, table});
	const seed = performance.now();
	await client.getItem({query: dynamoSingle(dbName)});
	const single = performance.now();
	const allItems = await dynamoScan({query: dynamoAll(table), client});
	const all = performance.now();
    await aggregation({query: dynamoAll(table), client, minutes: 15});
    const avg = performance.now();
    await aggregation({query: dynamoAll30Days(table), client, minutes: 15});
    const avg30 = performance.now();
    await aggregation({query: dynamoAll60Days(table), client, minutes: 15});
    const avg60 = performance.now();
	await insertOneDynamo({document: one, client});
	const insert = performance.now();
	await removeDb(client);
	const del = performance.now();
	return countTimers(start, create, seed, single, all, avg, avg30, avg60, insert, del);
};

export {dynamoTest};
