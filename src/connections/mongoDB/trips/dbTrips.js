import mongoose from "mongoose";

let connTrips = await mongoose.createConnection(process.env.MONGO_DB_URI_TRIPS).asPromise()

export default connTrips;