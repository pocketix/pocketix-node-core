import {prepareMany, prepareOne, runAndMeasure, timeStorage} from "./helpers.js";
import {influxTest, influxTestTemperature} from "./tests/influxTest.js";
import {dynamoTest} from "./tests/dynamoTest.js";
import pkg from 'lodash';
const {cloneDeep} = pkg;
import {mongoSeriesTest, mongoSeriesTestTemp, mongoTest, mongoTestTemp} from "./tests/mongoTest.js";
import {postgresTest} from "./tests/postgresTest.js";

const benchmark = async (file) => {
	const one = prepareOne();
	const documents = prepareMany(file);
	const values = [];
	const averages = {
		influxTest: timeStorage(),
		mongoTest: timeStorage(),
		mongoSeriesTest: timeStorage(),
		dynamoTest: timeStorage(),
		postgresTest: timeStorage()
	};
	const repeatCount = 20;

	for (const _ of [...Array(repeatCount).keys()]) {
        //console.log(`Running dynamo ${_} / ${repeatCount}`);
        //values.push(await runAndMeasure(dynamoTest, cloneDeep(one), cloneDeep(documents)));
        console.log(`Running mongo ${_} / ${repeatCount}`);
		values.push(await runAndMeasure(mongoTest, cloneDeep(one), cloneDeep(documents)));
        console.log(`Running mongo series ${_} / ${repeatCount}`);
		values.push(await runAndMeasure(mongoSeriesTest, cloneDeep(one), cloneDeep(documents)));
        console.log(`Running mongo6 ${_} / ${repeatCount}`);
		values.push(await runAndMeasure(mongoTest, cloneDeep(one), cloneDeep(documents), 6666));
        console.log(`Running mongo6 series ${_} / ${repeatCount}`);
		values.push(await runAndMeasure(mongoSeriesTest, cloneDeep(one), cloneDeep(documents), 6666));
        console.log(`Running influx ${_} / ${repeatCount}`);
        values.push(await runAndMeasure(influxTest, cloneDeep(one), cloneDeep(documents)));
        console.log(`Running postgres ${_} / ${repeatCount}`);
		values.push(await runAndMeasure(postgresTest, cloneDeep(one), cloneDeep(documents)));
	}

	values.forEach((item) => {
		const key = item.name;
		delete item.function;
		delete item.start;
		delete item.end;
        averages[key] = {};
		Object.entries(item).forEach(([k, value]) => averages[key][k] = averages[key][k] ? averages[key][k] + value : value);
	});

    console.log(values);
	console.log(averages);
};

const tempBenchmark = async (file) => {
    const documents = prepareMany(file);
    const values = [];
    const averages = {};
    const repeatCount = 1;

    for (const _ of [...Array(repeatCount).keys()]) {
        console.log(`Running mongo ${_} / ${repeatCount}`);
        values.push(await runAndMeasure(mongoTestTemp, undefined, cloneDeep(documents)));
        console.log(`Running mongo series ${_} / ${repeatCount}`);
        values.push(await runAndMeasure(mongoSeriesTestTemp, undefined, cloneDeep(documents)));
        console.log(`Running mongo6 ${_} / ${repeatCount}`);
        values.push(await runAndMeasure(mongoTestTemp, undefined, cloneDeep(documents), 6666));
        console.log(`Running mongo6 series ${_} / ${repeatCount}`);
        values.push(await runAndMeasure(mongoSeriesTestTemp, undefined, cloneDeep(documents), 6666));
        console.log(`Running influx ${_} / ${repeatCount}`);
        values.push(await runAndMeasure(influxTestTemperature, undefined, cloneDeep(documents)));
    }

    values.forEach((item) => {
        const key = item.name;
        delete item.function;
        delete item.start;
        delete item.end;
        averages[key] = {};
        Object.entries(item).forEach(([k, value]) => averages[key][k] = averages[key][k] ? averages[key][k] + value : value);
    });

    console.log(values);
    console.log(averages);
}

export {benchmark, tempBenchmark};
