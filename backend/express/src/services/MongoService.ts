import {
    InfluxQueryInput,
    InfluxQueryResult,
    InputData,
    Operation,
    OutputData
} from '../../../InfluxDataBase/api/influxTypes';
import {StatisticsService} from './StatisticsService';
import {Service} from 'typedi';
import {Collection, MongoClient} from 'mongodb';


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
        const data = await this.collection.aggregate(createPipeline(query)).toArray();
        return {
            data: data as OutputData[],
            status: 0
        };
    }

    async saveData(data: InputData[], bucket: string): Promise<void> {
        await this.collection.insertMany(data as any);
    }

    async saveOne(data: InputData, bucket: string): Promise<void> {
        await this.collection.insertOne(data as any);
    }

    async statistics(query: InfluxQueryInput): Promise<InfluxQueryResult> {
        query.param.aggregateMinutes = undefined;
        const data = await this.collection.aggregate(createPipeline(query)).toArray();
        return {
            data: data as OutputData[],
            status: 0
        };
    }

}

export {MongoService};

const createPipeline = (query: InfluxQueryInput) => {
    const thirtyDaysBack = new Date();
    thirtyDaysBack.setDate((new Date().getDate() - 30));

    const from = query.param.from ?? thirtyDaysBack;
    const to = query.param.to ?? new Date();

    const operationToAggregation = {
        ['mean' as Operation]: 'avg'
    };

    const fields = (Object.entries(query.param.sensors).map(([_, value]: [string, string[]]) => value) as Array<string[]>).flat();

    const aggregationFields = fields.map(
        field => `${field}: {'${operationToAggregation[query.operation ?? 'mean']}': '$${field}'}`
    ).join(',/n');

    const sensors = typeof query.param.sensors === 'object' ?
        Object.entries(query.param.sensors).map(([key, _]) => key) : query.param.sensors;

    const mongoQuery: any[] = [
        {
            $match: {
                date: {
                    $gte: from,
                    $lt: to
                },
                sensor: {
                    $in: [
                        sensors.join(', ')
                    ]
                }
            }
        }, {
            $set: {
                date: '$_id.date',
                sensor: '$_id.sensor'
            }
        }, {
            $unset: [
                '_id'
            ]
        }
    ];

    if (query.param.aggregateMinutes) {
        mongoQuery.splice(1, 0, {
            $group: {
                _id: {
                    date: {
                        $toDate: {
                            $subtract: [
                                {
                                    $toLong: '$date'
                                }, {
                                    $mod: [
                                        {
                                            $toLong: '$date'
                                        }, 60000 * (query.param.aggregateMinutes ?? 15)
                                    ]
                                }
                            ]
                        }
                    },
                    sensor: '$sensor'
                },
                aggregationFields
            }
        });
    }

    return mongoQuery;
};
