import AWS from 'aws-sdk';
import {defaultDict} from "../helpers.js"
const dbName = 'boilerSpeedTest'

const defaultDBConfig = {
	TableName: dbName,
	KeySchema: [
		{
			"AttributeName": "date",
			"KeyType": "HASH"
		}
	],
	AttributeDefinitions: [
		{
			"AttributeName": "date",
			"AttributeType": "S"
		},
	],
	ProvisionedThroughput: {
		'ReadCapacityUnits': 10,
		'WriteCapacityUnits': 10
	}
}

const defaultConfig = {
	region: 'localhost',
	endpoint: "http://dynamo:8000",
	accessKeyId: "AKIAIOSFODNN7EXAMPLE",
	secretAccessKey: "xxwJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEYxx",
}

const init = async (config=defaultConfig) => {
	AWS.config.update(config);
	return new AWS.DynamoDB();
};

const executeScan = async ({query, client}) => {
	let items;
	let data = []
	do {
		items = await client.scan(query).promise();
		items.Items.forEach((item) => data.push(item));
		query.ExclusiveStartKey = items.LastEvaluatedKey;

	} while (typeof items.LastEvaluatedKey != "undefined");

	return data;
};

const insertOne = async ({document, client}) => {
	const documentClient = new AWS.DynamoDB.DocumentClient();
	await documentClient.put(document);
};

const transformOne = (document) => {
	const date = document["date"];
	delete document["date"];
	const items = {}
	Object.entries(document).forEach(([key, value]) => {
		typeof value == "number" ? items[key] = {"N": value.toString()} : null;
	});
	return {
		PutRequest: {
			Item: {
				"date": {"S": date},
				...items
			}
		}
	};
};

const transformMany = (documents) => {
	return documents.map(document => transformOne(document));
}

/**
 * Inserts multiple documents to DynamoDB
 * It would be possible to use BatchWriteItem https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/batchwriteitemcommand.html
 * here, but it wouldn't overcome most of the limitations (still only 25 requests can be sent). This is not the main part of the benchmark
 * as there is generally no need to seed series tables (this happens only in some edge cases, like switching from one database to another).
 * @param document
 * @param table
 * @return {Promise<void>}
 */
const insertMany = async ({document, table}) => {
	const documentClient = new AWS.DynamoDB.DocumentClient();
	for (const item of document) {
		await documentClient.put({TableName: table.table, Item: item}, function(err, data) {
			if (err) {
				console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
			}
		});
	}
};

const createDb = (client, dbConfig = defaultDBConfig) => {
	return client.createTable(dbConfig, function(err, data) {
		if (err) {
			console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
		}
	});
}

const removeDb = (client) => {
	return client.deleteTable({TableName: dbName}, function(err, data) {
		if (err) {
			console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
		} else {
			console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
		}
	});
}

const aggregation = async ({query, client, minutes}) => {
	let items;
	let data = [];

	do {
		items = await client.scan(query).promise();
		items.Items.forEach((item) => data.push(item));
		query.ExclusiveStartKey = items.LastEvaluatedKey;
	} while (typeof items.LastEvaluatedKey != "undefined");

	let result = {};
	let previous = new Date(new Date(data[0].date.S).getTime() + minutes * 6000);
	previous = new Date(previous.getTime() + minutes * 6000);
	result[new Date(previous.getTime() - minutes / 2 * 6000)] = defaultDict();
	let count = 0;
	data.forEach((item) => {
		let bin = new Date(previous - minutes / 2 * 6000);
		if (new Date(item.date.S) <= previous) {
			count++;
		} else {
			Object.entries(result[bin]).forEach(([key, value]) => {
				result[bin][key] = value / count;
			});
			previous = new Date(previous.getTime() + minutes * 6000);
			bin = new Date(previous.getTime() - minutes / 2 * 6000);
			result[bin] = defaultDict();
			count = 1;
		}

		delete item.date;
		Object.entries(item).forEach(([key, value]) => {
			result[bin][key] += parseFloat(value.N);
		});
	})

	return result;
};

export {init, executeScan, insertOne, insertMany, aggregation, createDb, removeDb};
