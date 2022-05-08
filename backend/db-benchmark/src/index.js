import { Command } from 'commander';
import {benchmark} from "./allDbBenchmark.js";


const program = new Command();
program.option("-b, --benchmark <file>", "benchmark on boiler data (requires Mongo, Dynamo and Influx)");
program.parse(process.argv);
const options = program.opts();

const file = options.benchmark || 'boiler0910-series.json';
if (options.benchmark)
	await benchmark(file);
