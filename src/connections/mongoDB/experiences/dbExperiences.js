import mongoose from "mongoose";

let connExperiences = await mongoose.createConnection(process.env.MONGO_DB_URI_EXPERIENCES).asPromise()

export default connExperiences;