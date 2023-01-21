import { Command } from 'commander';
import {benchmark, tempBenchmark} from "./allDbBenchmark.js";


const program = new Command();
program.option(
	"-b, --benchmark <file>",
	"benchmark on boiler data (requires Mongo, Dynamo and Influx)",
	process.env.file || 'boiler0910-series.json'
);

program.option(
    "-t, --temp <tempFile>",
    "Benchmark using Rising temperature sensors",
    process.env.file
);

program.parse(process.argv);
const options = program.opts();

const file = options.benchmark;
const tempFile = options.temp;
console.log("Running benchmark on file:", file);

if (options.temp) {
    console.log(tempFile);
    await tempBenchmark(tempFile);
}
else if (options.benchmark)
	await benchmark(file);
