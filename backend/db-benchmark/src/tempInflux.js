import {tempParser} from "./helpers.js";
import {executeQuery, init as influxInit, insertManyPoints, transformToPointTags} from "./databases/influx.js";
import {influxAll} from "./databases/queries.js";
const bucket = "temp";

const insertTempMany = async () => {
	const data = await tempParser();
	await insertMany(data);
};

const insertMany = async (data) => {
	const influx = influxInit();
	await insertManyPoints({
		client: influx,
		bucket,
		points: transformToPointTags({data, measurement: "device", tags: ["type"]})
	});
}

const getAndReconstruct = async () => {
	const influx = await influxInit();
	const query = influxAll({bucket});
	const data = await executeQuery({query, client: influx});
	return data.map(item => {return {measurement: item._measurement, time: item._time, [item._field]: item._value}});
}

export {insertTempMany, getAndReconstruct, insertMany};
