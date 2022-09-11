import {MongoClient} from 'mongodb'
const host = (port) => port ? process.env.mongo6 : process.env.mongo || "localhost";


const init = (port) => {
    console.log(port, );
    console.log(`mongodb://${host(port)}:${port ?? 8888}`);
	return new MongoClient(`mongodb://${host(port)}:${typeof port === "number" ? port : 8888}`);
};

const selectCollection = (client, database, collection) => {
	return client.db(database).collection(collection);
};

const executeQuery = async ({query, client, collection}) => {
	return await connectAndClose(query, client, (query) => collection.find(query).toArray());
};

const executeAggregation = async ({query, client, collection}) => {
	return await connectAndClose(query, client, (query) => collection.aggregate(query).toArray());
};

const connectAndClose = async (query, client, callback) => {
	await client.connect();
	const data = await callback(query);
	client.close();
	return data;
};

const insertOne = async ({document, client, collection}) => {
	document.date = new Date(document.date);
	return await connectAndClose(document, client, (document) => collection.insertOne(document));
};

const insertMany = async ({documents, client, collection}) => {
	documents.forEach((item) => item.date = new Date(item.date));
	return await connectAndClose(documents, client, (documents) => collection.insertMany(documents));
};

const createCollection = async ({name, database, client, series}) => {
	await connectAndClose(name, client, (name) =>
		series ? client.db(database).createCollection(name) : client.db(database).createCollection(name, {timeseries: {timeField: "date", granularity: "minutes"}})
	);
}

const dropCollection = async ({name, database, client}) => {
	await connectAndClose(name, client, (name) => client.db(database).dropCollection(name));
}

export {init, executeQuery, executeAggregation, selectCollection, insertMany, insertOne, createCollection, dropCollection};


