import postgres from 'postgres';
import pkg from 'pg';
const {Client} = pkg;

import {aggregateQuery, create, preseed as preseedQuery} from "./sqlQueries.js";



const init = async () => {
	const clients = [postgres({
		database: "test",
		username: "postgres"
	}), new Client(
		{
			database: "test",
			user: "postgres"
		}
	)];
	clients[1].connect();
	return  clients;
};

const createDb = async ([_, pg]) => {
	await pg.query(create);
};

const select = async ([_, pg], query) => {
	return await pg.query(query);
};

const insertOne = async (client, item) => {
	await insertMany(client, [item])
};

const insertMany = async ([client, _], items) => {
	const queryValues = [];

	await client.begin(async sql => {
		const ids = await sql`SELECT sensor_fields.id as id, field_name
                        FROM test_schema.sensor_fields
                                 LEFT JOIN test_schema.sensor ON sensor_fields.sensor = sensor.id
                                 LEFT JOIN test_schema.types ON sensor_fields.type = types.id`;

		const fieldsToId = {};

		for (const id of ids)
			fieldsToId[id["field_name"]] = id["id"];

		for (const item of items) {
			const date = new Date(item["date"]);
			delete item["date"];
			for (const field in item) {

				if (typeof item[field] !== "number")
					continue;

				queryValues.push({field: fieldsToId[field], value: item[field], timestamp: date});
			}
		}

		let i, j, temporary, chunk = 21250;
		for (i = 0,j = queryValues.length; i < j; i += chunk) {
			temporary = queryValues.slice(i, i + chunk);
			await sql`INSERT INTO test_schema.measurements ${sql(temporary, "field", "value", "timestamp")}`;
		}
	});

	return [queryValues.length];
};

const aggregation = async ([_, pg]) => {
	await pg.query(aggregateQuery);
};

const preSeed = async ([_, pg]) => {
	await pg.query(preseedQuery);
}

const removeDb = async ([client, pg]) => {
	await pg.query("DROP SCHEMA IF EXISTS test_schema CASCADE");
	await client.end();
	await pg.end();
};


export {init, select, insertOne, insertMany, aggregation, createDb, removeDb, preSeed};
