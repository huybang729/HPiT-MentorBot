import { MongoClient, ServerApiVersion } from "mongodb"
import dotenv from "dotenv";
dotenv.config();
let dataBaseInstance = null;
console.log("URI: ", process.env.MONGODB_URI)
const mongoClientInstance = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})

export const CONNECT_DB = async () => {
    await mongoClientInstance.connect()
    dataBaseInstance = mongoClientInstance.db(process.env.DATABASE_NAME)
}

export const GET_DB = () => {
    if (!dataBaseInstance) throw new Error("Database connection Error")
    return dataBaseInstance
}