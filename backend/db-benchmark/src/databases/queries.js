const influxSingle = ({bucket}) => `from(bucket: "${bucket}") 
  |> range(start: 2021-09-09T09:44:00.892Z, stop: 2021-09-09T09:44:02.192Z)`;

const influxAll = ({bucket}) => `from(bucket: "${bucket}") |> range(start: 2021-09-09T09:44:01.892Z)`;

const influxAggregateAvg = ({bucket, minutes}) => `from(bucket: "${bucket}")
  |> range(start: 2021-09-09T09:44:01.892Z)
  |> filter(fn: (r) => r["_measurement"] == "boiler")
  |> filter(fn: (r) => r["host"] == "host1")
  |> aggregateWindow(every: ${minutes}m, fn: mean, createEmpty: false)
  |> yield(name: "mean")
  `;

const mongoSingle = ({}) => {
	return {"date": new Date("2021-09-09T09:44:01.892Z")}
};

const mongoAll = ({}) => {
	return {}
};

const mongoAggregateAvg = ({minutes}) => {
	return [{
		'$group': {
			'_id': {
				'$toDate': {
					'$subtract': [
						{'$toLong': {'$toDate': '$_id'}},
						{'$mod': [{'$toLong': {'$toDate': '$_id'}}, 1000 * minutes * 15]}
					]
				}
			},
			'date': {'$avg': '$date'},
			't1_calibration': {'$avg': '$t1_calibration'},
			't1_temperature': {'$avg': '$t1_temperature'},
			't2_calibration': {'$avg': '$t2_calibration'},
			't2_temperature': {'$avg': '$t2_temperature'},
			'dhw_calibration': {'$avg': '$dhw_calibration'},
			'dhw_temperature': {'$avg': '$dhw_temperature'},
			'boiler_calibration': {'$avg': '$boiler_calibration'},
			'boiler_temperature': {'$avg': '$boiler_temperature'},
			'feeder_calibration': {'$avg': '$feeder_calibration'},
			'feeder_temperature': {'$avg': '$feeder_temperature'},
			'outside_calibration': {'$avg': '$outside_calibration'},
			'outside_temperature': {'$avg': '$outside_temperature'},
			'indoor_calibration': {'$avg': '$indoor_calibration'},
			'indoor_temperature': {'$avg': '$indoor_temperature'},
			'return_calibration': {'$avg': '$return_calibration'},
			'return_temperature': {'$avg': '$return_temperature'},
			'ch1_internal_temperature': {'$avg': '$ch1_internal_temperature'},
			'ch1_internal_normalized': {'$avg': '$ch1_internal_normalized'},
			'ch2_internal_temperature': {'$avg': '$ch2_internal_temperature'},
			'ch2_internal_normalized': {'$avg': '$ch2_internal_normalized'}
		}
	}];
};

const dynamoAll = ({table}) => {
	return {TableName: table}
}

const dynamoSingle = ({table}) => {
	return {TableName: table, Key: {"date": "2021-09-09T09:44:01.892"}, ProjectionExpression: 'ATTRIBUTE_NAME'}
}

export {influxSingle, influxAll, influxAggregateAvg, mongoSingle, mongoAll, mongoAggregateAvg, dynamoSingle, dynamoAll};
