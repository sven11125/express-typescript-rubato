import { Db, MongoClient } from "mongodb"
import { Config } from '../utils/config'

let mongo: MongoClient;
export let mongoDb: Db;

export let resultsCollection: Db;

export const initMongo = async () => {

    let connectionString = Config.monogUrl

    mongo = await MongoClient.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    mongoDb = mongo.db(Config.mongoDatabase)

    if (!mongo) {
        throw 'Could not connect to Mongo'
    }
}