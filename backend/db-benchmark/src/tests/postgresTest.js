import {performance} from "perf_hooks";
import {createDb, init, insertMany, removeDb, preSeed, aggregation, select, insertOne} from "../databases/postgres.js";
import {all as allQuery, single as singleQuery} from "../databases/sqlQueries.js";
import {countTimers} from "../helpers.js";

const postgresTest = async (documents, one) => {
	const client = await init();
	const start = performance.now();
	await createDb(client);
	await preSeed(client);
	const create = performance.now();
	await insertMany(client, documents);
	const seed = performance.now();
	await select(client, singleQuery);
	const single = performance.now();
	await select(client, allQuery);
	const all = performance.now();
	await aggregation(client);
	const avg = performance.now();
	await insertOne(client, one);
	const insert = performance.now();
	await removeDb(client);
	const del = performance.now();
	return countTimers(start, create, seed, single, all, avg, insert, del);
}

export {postgresTest};
