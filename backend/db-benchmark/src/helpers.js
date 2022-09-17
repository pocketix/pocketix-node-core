import fs from "fs";
import {performance} from "perf_hooks";
import pkg from 'lodash';
import * as csv from "fast-csv";

const {cloneDeep} = pkg;

const prepareMany = (file) => {
	const data = JSON.parse(fs.readFileSync(file));
	return data.map((item) => {
		delete item["_id"];
		const date = item["date"]["$date"];
		delete item["date"];
		item["date"] = date;
		return item;
	});
};

const prepareOne = () => {
	const one = JSON.parse(fs.readFileSync('single.json'));
	delete one["date"];
	one["date"] = (new Date()).toISOString();
	return one;
}

const runAndMeasure = async (callback, one, documents) => {
	const start = performance.now();
	const data = await callback(cloneDeep(documents), cloneDeep(one));
	const end = performance.now();

	return {function: callback, time: end - start, start, end, ...data};
}

const countTimers = (start, create, seed, single, all, avg, avg30, avg60, insert, del) => {
	return {
		create: create - start,
		seed: seed - start,
		single: single - seed,
		all: all - single,
		avg: avg - all,
        avg30: avg30 - avg,
        avg60: avg60 - avg30,
		insert: insert - avg60,
		del: del - insert,
	};
}

const defaultDict = () => {
	return new Proxy({}, {get: (target, name) => name in target ? target[name] : 0});
}

const timeStorage = () => {
	return {
		time: 0,
		create: 0,
		seed: 0,
		single: 0,
		all: 0,
		avg: 0,
		insert: 0,
		del: 0
	};
}

const removeAddedChar = (string) => {
	return string.slice(0,1) === "'" ? string.substring(1) : string;
}

const rowParser = (row, accumulator) => {
	accumulator.push({
		device: row["deviceUid"],
		type: row["deviceType"],
		date: new Date(row["tst"] * 1000),
		battery: parseFloat(row["battery"]),
		value: parseFloat(removeAddedChar(row["distance_cm"].substring(1)))
	});
}

const tempParser = async () => {
	let accumulator = [];

	const parser = csv.parseFile("results.csv", {headers: true})
		.on('error', error => console.error(error))
		.on('data', (row) => rowParser(row, accumulator));

	await new Promise((resolve, reject) => {
		parser.on("finish", () => resolve());
		parser.on("error", () => reject());
	});

	return accumulator
};

export {prepareOne, prepareMany, runAndMeasure, countTimers, defaultDict, timeStorage, tempParser};
