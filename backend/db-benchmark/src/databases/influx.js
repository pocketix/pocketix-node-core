import {InfluxDB, Point} from "@influxdata/influxdb-client";
import {BucketsAPI} from "@influxdata/influxdb-client-apis";

const dbName = 'boilerSpeedTest'
const token = '0srXHadc_qKZLnLP7396XeeFx6Fi2jUleVx4yrTZhU2MhCMaA-7RUjbR5Smtrupffy3AbBH9g1Ot6X1o_ZGeAA==';
const org = "my-org";
const orgID = "fc015024af17e8aa"

const init = () => {
	return new InfluxDB({url: 'http://localhost:8086', token: token});
};

const executeQuery = async ({query, client}) => {
	const queryApi = client.getQueryApi(org);
	let response = [];
	await queryApi.collectRows(query).then(
		(values => response = values),
		(error) => console.log(error)
	);

	return response;
};

/**
 * Convert Array of Object measurements to Array of InfluxDB Points
 * @param data Array of Objects with data, must contain field "date", measurement and all tags
 * @param measurement Name of the measurement inside of InfluxDB bucket (most likely Sensor ID)
 * @param tags Keys of additional tags
 * @param host Host for overriding sharding, defaults to "host1"
 * @returns Point[] Array of points
 */
const transformToPointTags = ({data, measurement, tags, host="host1"}) => {
	return data.map(data => {
		const keys = Object.keys(data).filter(x => ![...tags, "date", measurement].includes(x));
		const initialPoint = new Point(data[measurement]).timestamp(data.date).tag("host", host);
		const taggedPoint = tags.reduce((point, tag) => point.tag(tag, data[tag]), initialPoint);
		return keys.reduce((point, key) => point.floatField(key, data[key]), taggedPoint);
	});
};

const insertManyPoints = async ({client, bucket, points}) => {
	const writeApi = client.getWriteApi(org, bucket, "s");
	writeApi.writePoints(points);
	await writeApi.close();
}

const transformToPoint = (data, key = null) => {
	const date = data["date"];
	delete data["date"];
	const initialValue = new Point(key === null ? "boiler" : data[key]).tag("host", "host1").timestamp(new Date(date));
	if (key) delete data[key];
	return Object.entries(data).reduce((previousValue, [key, value]) =>
		typeof value === "number" ? previousValue.floatField(key, value) : previousValue, initialValue);
};

const insertOne = async ({data, client, key, bucket = dbName}) => {
	const writeApi = client.getWriteApi(org, bucket, "s");
	writeApi.writePoint(transformToPoint(data, key));
	await writeApi.close();
};

const insertMany = async ({data, client, key, bucket = dbName}) => {
	const writeApi = client.getWriteApi(org, bucket, "s");
	writeApi.writePoints(data.map((item) => transformToPoint(item, key)));
	await writeApi.close();
};

const deleteBucket = async ({name, client}) => {
	const bucketsApi = new BucketsAPI(client);
	const buckets = await bucketsApi.getBuckets({orgID, name});
	if (buckets && buckets.buckets && buckets.buckets.length)
		await bucketsApi.deleteBucketsID({bucketID: buckets.buckets[0].id});
}

const createBucket = async ({name, client}) => {
	const bucketsApi = new BucketsAPI(client);
	const bucket = await bucketsApi.postBuckets({body: {orgID: orgID, name: name, retentionRules: []}});
}

export {executeQuery, init, insertOne, insertMany, deleteBucket, createBucket, transformToPointTags, insertManyPoints}
