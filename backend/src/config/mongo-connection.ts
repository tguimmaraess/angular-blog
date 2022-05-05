import { MongoClient, ObjectId } from "mongodb";

// Connection URI
const uri = "mongodb+srv://user:user12345@cluster0.xdibk.mongodb.net/retryWrites=true&w=majority";

// Creates a new MongoClient
const client = new MongoClient(uri);

//Establishes a connection
const connection = async function() {
    await client.connect();
    return client.db("adminPanel");
}

//export default  connection
export {connection, ObjectId};
