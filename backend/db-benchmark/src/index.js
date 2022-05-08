import { Command } from 'commander';
import {benchmark} from "./allDbBenchmark.js";


const program = new Command();
program.option(
	"-b, --benchmark <file>",
	"benchmark on boiler data (requires Mongo, Dynamo and Influx)",
	process.env.file || 'boiler0910-series.json'
);
program.parse(process.argv);
const options = program.opts();

const file = options.benchmark;
console.log("Running benchmark on file:", file);

if (options.benchmark)
	await benchmark(file);
