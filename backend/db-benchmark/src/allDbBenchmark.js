import {prepareMany, prepareOne, runAndMeasure, timeStorage} from "./helpers.js";
import {influxTest} from "./tests/influxTest.js";
import {dynamoTest} from "./tests/dynamoTest.js";
import pkg from 'lodash';
const {cloneDeep} = pkg;
import {mongoSeriesTest, mongoTest} from "./tests/mongoTest.js";
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
	const repeatCount = 15;

	for (const _ of [...Array(repeatCount).keys()]) {
        values.push(await runAndMeasure(dynamoTest, cloneDeep(one), cloneDeep(documents)));
        values.push(await runAndMeasure(influxTest, cloneDeep(one), cloneDeep(documents)));
        values.push(await runAndMeasure(mongoTest, cloneDeep(one), cloneDeep(documents)));
        values.push(await runAndMeasure(mongoSeriesTest, cloneDeep(one), cloneDeep(documents)));
		values.push(await runAndMeasure(postgresTest, cloneDeep(one), cloneDeep(documents)));
	}

	values.forEach((item) => {
		const key = item.function.name;
		delete item.function;
		delete item.start;
		delete item.end;
		Object.entries(item).forEach(([k, value]) => averages[key][k] += value);
	});

	console.log(averages);
};

export {benchmark};
