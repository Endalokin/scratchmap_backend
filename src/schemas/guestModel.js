import mongoose from "mongoose";

let connTests = await mongoose.createConnection(process.env.MONGO_DB_URI).asPromise()

const guestSchema = new mongoose.Schema({
  name: String
});

export default connTests.model("Guest", guestSchema);
// -> User wird für MongoDB in plural und kleingeschrieben umgewandelt und wird demzufolge zu der Collection "users"
