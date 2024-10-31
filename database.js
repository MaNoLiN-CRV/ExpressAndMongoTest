import { MongoClient } from "mongodb";
export default class Database {
    // Manuel used MongoClient instead of Mongoose, please Raul, don't hit me
    database = null;
    collection = null;
    /**
     * Initializes the database manager
     * @param {*} url Url of the mongodb database
     */
    constructor(url) {
        this.client = new MongoClient(url);
    }

    /**
     * Sets the database and collection
     * @param {*} database 
     * @param {*} collection 
     */
    selectDatabaseAndCollection(database, collection){
        this.database = this.client.db(database);
        this.collection = this.database.collection(collection);
    }

    /**
     * Inserts an object in the database
     * @param {*} object 
     * @returns True or false
     */
    async insertObject(object) {
        let dev = true;
        try {
            await this.client.connect();
            await this.collection.insertOne(object);
        }
        catch (e) {
            dev = false;
        }
        finally {
            this.client.close();
        }
        return dev;
    }

    /**
     * Search an object
     * @param {*} param0 key to find  
     * @returns 
     */
    async readObjectByValue({value}){
        let returnedObject;
        try {
            await this.client.connect();
            returnedObject = await this.collection.find(value); 
        }
        catch (e){
            returnedObject = null;
        }
        finally {
            this.client.close();
        }
        return returnedObject;
    }



};