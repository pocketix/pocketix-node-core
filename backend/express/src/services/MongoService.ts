import {
    ComparisonOperator,
    InfluxQueryInput,
    InfluxQueryResult,
    InputData, OutputData, SingleSimpleValue
} from "../../../InfluxDataBase/api/influxTypes";
import {StatisticsService} from "./StatisticsService";
import {Service} from "typedi";
import {Collection, MongoClient} from "mongodb";


@Service()
class MongoService implements StatisticsService {
    private mongoClient: MongoClient;
    private collection: Collection<Document>;

    constructor() {
        this.mongoClient = new MongoClient(process.env.MONGO_URL);
        this.collection = this.mongoClient.db(process.env.MONGO_DB).collection(process.env.MONGO_COLLECTION);
        this.mongoClient.connect();
    }

    async average(query: InfluxQueryInput): Promise<InfluxQueryResult> {
        const data = await this.collection.aggregate(createPipeline(query.param.sensors, query.param.aggregateMinutes, '$avg')).toArray();
        return {
            data: data as OutputData[],
            status: 0
        }
    }

    differenceBetweenFirstAndLast(data: InfluxQueryInput): Promise<InfluxQueryResult> {
        return Promise.resolve(undefined);
    }

    filterDistinctValue(data: InfluxQueryInput, isString: boolean, shouldCount: boolean, values: SingleSimpleValue[]): Promise<InfluxQueryResult> {
        return Promise.resolve(undefined);
    }

    lastOccurrenceOfValue(data: InfluxQueryInput, operator: ComparisonOperator, value: { [p: string]: any }): Promise<InfluxQueryResult> {
        return Promise.resolve(undefined);
    }

    parameterAggregationWithMultipleStarts(data: InfluxQueryInput, starts: string[]): Promise<InfluxQueryResult> {
        return Promise.resolve(undefined);
    }

    async saveData(data: InputData[], bucket: string): Promise<void> {
        await this.collection.insertMany(data as any);
    }

    async saveOne(data: InputData, bucket: string): Promise<void> {
        await this.collection.insertOne(data as any);
    }

    async statistics(query: InfluxQueryInput): Promise<InfluxQueryResult> {

    }

}

export {MongoService};

const createPipeline = (fields: string[], minutes: number, aggregation: string) => {
    const aggregationFields = fields.map(field => `${field}: {'${aggregation}': '$${field}'}`).join(',/n');
    return [
        {
            '$group': {
                '_id': {
                    '$toDate': {
                        '$subtract': [
                            {'$toLong': '$date'},
                            {'$mod': [{'$toLong': '$date'}, 60000 * minutes]}
                        ]
                    }
                }, 
                aggregationFields
            }
        },
        {
            '$set': {
                'date': {
                    '$toDate': '$_id'
                }
            }
        }
    ];
};
