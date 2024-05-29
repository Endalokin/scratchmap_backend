import mongoose from "mongoose";

let connUsers = await mongoose.createConnection(process.env.MONGO_DB_URI_USERS).asPromise()

export default connUsers;