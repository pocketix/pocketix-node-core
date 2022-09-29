const create = "CREATE SCHEMA test_schema;" +
	"create table test_schema.sensor\n" +
	"(\n" +
	"    id   serial\n" +
	"        constraint sensor_pk\n" +
	"            primary key,\n" +
	"    name varchar(255) not null\n" +
	");\n" +
	"\n" +
	"alter table test_schema.sensor\n" +
	"    owner to postgres;\n" +
	"\n" +
	"create unique index sensor_name_uindex\n" +
	"    on test_schema.sensor (name);\n" +
	"\n" +
	"create table test_schema.types\n" +
	"(\n" +
	"    id   integer      not null\n" +
	"        constraint types_pk\n" +
	"            primary key,\n" +
	"    name varchar(255) not null\n" +
	");\n" +
	"\n" +
	"alter table test_schema.types\n" +
	"    owner to postgres;\n" +
	"\n" +
	"create table test_schema.sensor_fields\n" +
	"(\n" +
	"    id         serial\n" +
	"        constraint sensor_fields_pk\n" +
	"            primary key,\n" +
	"    field_name varchar(255) not null,\n" +
	"    sensor     integer      not null\n" +
	"        constraint sensor_fields_sensor_id_fk\n" +
	"            references test_schema.sensor,\n" +
	"    type       integer      not null\n" +
	"        constraint sensor_fields_types_id_fk\n" +
	"            references test_schema.types\n" +
	"            on update cascade on delete cascade\n" +
	");\n" +
	"\n" +
	"alter table test_schema.sensor_fields\n" +
	"    owner to postgres;\n" +
	"\n" +
	"create unique index sensor_fields_field_name_uindex\n" +
	"    on test_schema.sensor_fields (field_name);\n" +
	"\n" +
	"create table test_schema.measurements\n" +
	"(\n" +
	"    id        serial\n" +
	"        constraint measurements_pk\n" +
	"            primary key,\n" +
	"    field     integer          not null\n" +
	"        constraint measurements_sensor_fields_id_fk\n" +
	"            references test_schema.sensor_fields\n" +
	"            on update cascade on delete cascade,\n" +
	"    value     double precision not null,\n" +
	"    timestamp timestamp        not null\n" +
	");\n" +
	"\n" +
	"alter table test_schema.measurements\n" +
	"    owner to postgres;\n" +
	"\n" +
	"create index time__measurements__index\n" +
	"    on test_schema.measurements (timestamp desc);\n" +
	"\n";


const preseed = "INSERT INTO test_schema.sensor (name) VALUES ('boiler');\n" +
	"INSERT INTO test_schema.types (id, \"name\") VALUES (1, 'boiler');\n" +
	"INSERT INTO test_schema.sensor_fields (field_name, sensor, type) VALUES ('t1_calibration', 1, 1), ('t1_temperature', 1, 1), ('t2_calibration', 1, 1), ('t2_temperature', 1, 1), ('dhw_calibration', 1, 1), ('dhw_temperature', 1, 1), ('boiler_calibration', 1, 1), ('boiler_temperature', 1, 1), ('feeder_calibration', 1, 1), ('feeder_temperature', 1, 1), ('outside_calibration', 1, 1), ('outside_temperature', 1, 1), ('indoor_calibration', 1, 1), ('indoor_temperature', 1, 1), ('return_calibration', 1, 1), ('return_temperature', 1, 1), ('ch1_internal_temperature', 1, 1), ('ch1_internal_normalized', 1, 1), ('ch2_internal_temperature', 1, 1), ('ch2_internal_normalized', 1, 1);\n"


const aggregateQuery = "SELECT AVG(test_schema.measurements.value) as value,\n" +
	"       date_trunc('hour', test_schema.measurements.timestamp) +\n" +
	"       (\n" +
	"           (\n" +
	"               (\n" +
	"                   date_part('minute', test_schema.measurements.timestamp)::integer\n" +
	"                       /\n" +
	"                   10::integer\n" +
	"               ) * 10::integer\n" +
	"           ) || ' minutes'\n" +
	"       )::interval AS \"timestamp\",\n" +
	"       test_schema.sensor.name as sensor,\n" +
	"       test_schema.types.name as field,\n" +
	"       test_schema.sensor_fields.field_name as \"type\"\n" +
	"FROM test_schema.measurements\n" +
	"    LEFT JOIN test_schema.sensor_fields ON test_schema.measurements.field = test_schema.sensor_fields.id\n" +
	"    LEFT JOIN test_schema.types ON test_schema.sensor_fields.type = test_schema.types.id\n" +
	"    LEFT JOIN test_schema.sensor ON test_schema.sensor_fields.sensor = test_schema.sensor.id\n" +
	"\n" +
	"GROUP BY \"timestamp\",\n" +
	"         test_schema.measurements.field,\n" +
	"         test_schema.sensor.name,\n" +
	"         test_schema.types.name,\n" +
	"         test_schema.sensor_fields.field_name,\n" +
	"         test_schema.sensor_fields.id\n" +
	"\n" +
	"ORDER BY \"timestamp\",\n" +
	"         test_schema.sensor_fields.id";

const all = "SELECT * FROM test_schema.measurements LEFT JOIN test_schema.sensor_fields ON test_schema.measurements.field = test_schema.sensor_fields.id\n" +
	"    LEFT JOIN test_schema.types ON test_schema.sensor_fields.type = test_schema.types.id\n" +
	"    LEFT JOIN test_schema.sensor ON test_schema.sensor_fields.sensor = test_schema.sensor.id";

const single = "SELECT * FROM test_schema.measurements LEFT JOIN test_schema.sensor_fields ON test_schema.measurements.field = test_schema.sensor_fields.id\n" +
	"    LEFT JOIN test_schema.types ON test_schema.sensor_fields.type = test_schema.types.id\n" +
	"    LEFT JOIN test_schema.sensor ON test_schema.sensor_fields.sensor = test_schema.sensor.id LIMIT 1"


const aggregateQuery30Days = "SELECT AVG(test_schema.measurements.value) as value,\n" +
    "       date_trunc('hour', test_schema.measurements.timestamp) +\n" +
    "       (\n" +
    "           (\n" +
    "               (\n" +
    "                   date_part('minute', test_schema.measurements.timestamp)::integer\n" +
    "                       /\n" +
    "                   10::integer\n" +
    "               ) * 10::integer\n" +
    "           ) || ' minutes'\n" +
    "       )::interval AS \"timestamp\",\n" +
    "       test_schema.sensor.name as sensor,\n" +
    "       test_schema.types.name as field,\n" +
    "       test_schema.sensor_fields.field_name as \"type\"\n" +
    "FROM test_schema.measurements\n" +
    "    LEFT JOIN test_schema.sensor_fields ON test_schema.measurements.field = test_schema.sensor_fields.id\n" +
    "    LEFT JOIN test_schema.types ON test_schema.sensor_fields.type = test_schema.types.id\n" +
    "    LEFT JOIN test_schema.sensor ON test_schema.sensor_fields.sensor = test_schema.sensor.id\n" +
    "WHERE test_schema.measurements.timestamp >= '2021-09-09 09:44:01'::timestamp OR test_schema.measurements.timestamp <= '2021-10-09 09:44:01'::timestamp" +
    "\n" +
    "GROUP BY \"timestamp\",\n" +
    "         test_schema.measurements.field,\n" +
    "         test_schema.sensor.name,\n" +
    "         test_schema.types.name,\n" +
    "         test_schema.sensor_fields.field_name,\n" +
    "         test_schema.sensor_fields.id\n" +
    "\n" +
    "ORDER BY \"timestamp\",\n" +
    "         test_schema.sensor_fields.id";

const aggregateQuery60Days = "SELECT AVG(test_schema.measurements.value) as value,\n" +
    "       date_trunc('hour', test_schema.measurements.timestamp) +\n" +
    "       (\n" +
    "           (\n" +
    "               (\n" +
    "                   date_part('minute', test_schema.measurements.timestamp)::integer\n" +
    "                       /\n" +
    "                   10::integer\n" +
    "               ) * 10::integer\n" +
    "           ) || ' minutes'\n" +
    "       )::interval AS \"timestamp\",\n" +
    "       test_schema.sensor.name as sensor,\n" +
    "       test_schema.types.name as field,\n" +
    "       test_schema.sensor_fields.field_name as \"type\"\n" +
    "FROM test_schema.measurements\n" +
    "    LEFT JOIN test_schema.sensor_fields ON test_schema.measurements.field = test_schema.sensor_fields.id\n" +
    "    LEFT JOIN test_schema.types ON test_schema.sensor_fields.type = test_schema.types.id\n" +
    "    LEFT JOIN test_schema.sensor ON test_schema.sensor_fields.sensor = test_schema.sensor.id\n" +
    "WHERE test_schema.measurements.timestamp >= '2021-09-09 09:44:01'::timestamp OR test_schema.measurements.timestamp <= '2021-11-09 09:44:01'::timestamp" +
    "\n" +
    "GROUP BY \"timestamp\",\n" +
    "         test_schema.measurements.field,\n" +
    "         test_schema.sensor.name,\n" +
    "         test_schema.types.name,\n" +
    "         test_schema.sensor_fields.field_name,\n" +
    "         test_schema.sensor_fields.id\n" +
    "\n" +
    "ORDER BY \"timestamp\",\n" +
    "         test_schema.sensor_fields.id";


export {
    create,
    preseed,
    aggregateQuery,
    all,
    single,
    aggregateQuery30Days,
    aggregateQuery60Days
};
