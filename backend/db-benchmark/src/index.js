import { Command } from 'commander';
import {benchmark} from "./allDbBenchmark.js";
import {getAndReconstruct, insertTempMany} from "./tempInflux.js";
import {clone} from "./clone.js";


const program = new Command();
program.option("-b, --benchmark", "benchmark on boiler data (requires Mongo, Dynamo and Influx)");
program.option("-t, --temp <action>", "run temp benchmark");
program.option("-c, --clone", "clone data from dynamodb");
program.parse(process.argv);
const options = program.opts();


if (options.benchmark)
	await benchmark();

if (options.temp === "insert-many")
	await insertTempMany();

if (options.temp === "get-all")
	console.log(await getAndReconstruct());

if (options.clone)
	await clone()
