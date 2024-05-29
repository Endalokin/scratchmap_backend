import mongoose from "mongoose";

const trackSchema = new mongoose.Schema({
  travelid: { type: String, required: true },
  name: String,
  path: [
    {
      lon: Number,
      lat: Number,
      alt: Number
    },
  ],
});

export default trackSchema;
// -> User wird für MongoDB in plural und kleingeschrieben umgewandelt und wird demzufolge zu der Collection "users"
