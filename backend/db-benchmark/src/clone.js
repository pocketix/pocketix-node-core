import {executeScan as dynamoScan, init as initDymano, insertMany as dynamoMany} from "./databases/dynamo.js";
import {dynamoAll} from "./databases/queries.js";
import {getAndReconstruct, insertMany} from "./tempInflux.js";
import {tempParser} from "./helpers.js";
import {createBucket, init as influxInit} from "./databases/influx.js";
import dotenv from 'dotenv'

//"deviceUid","tst","battery","deviceType","distance_cm"
const extractDynamo = (record) => {
	const row = {
		date: new Date(parseInt(record.tst.N) * 1000),
		type: record.deviceType.S,
		battery: parseFloat(record.battery.N),
		device: record.deviceUid.S,
	};
	const array = ["tst", "deviceType", "deviceUid"];
	array.forEach(e => delete record[e]);
	Object.entries(record).forEach(([key, value]) => {
		row[key] = value.hasOwnProperty("N") ? parseFloat(value.N) : value.S;
	})
	return row;
}

/**
 * 1) Connect to dynamo
 * 2) Get all data
 * 3) Transform all data to points
 * 4) Store in influx
 * @returns
 */
const clone = async () => {
	dotenv.config();
	const config = {
		region: process.env.REGION,
		accessKeyId: process.env.ACCESS_ID,
		secretAccessKey: process.env.SECRET_KEY,
	};
	const client = await initDymano(config);
	const table = process.env.TABLE;
	const query = dynamoAll({table});

	const result = await dynamoScan({query, client});
	const influx = influxInit();
	const data = result.map(result => extractDynamo(result));
	await createBucket({name: "temp2", client: influx});
	await insertMany(data);
	return await getAndReconstruct();
}

const importToDynamo = async () => {
	const client = await initDymano();

	const table = {table: "temp"};
	const data = (await tempParser()).map(item => {
		const date = item["date"];
		delete item["date"];
		item["date"] = date.getTime() / 1000;
		return item;
	});
	await dynamoMany({document: data, table});
	const result = await dynamoScan({query: dynamoAll(table), client});
	console.log(result);
}

export {clone, importToDynamo};
