import mongoose from "mongoose";

const exifSchema = new mongoose.Schema({
  imgid: {type: String, required: true},
  datetime: Date,
  offsettime: String,
  lat: Number,
  lon: Number,
  altitude: Number,
  direction: Number,
  positioningerror: Number,
  coordsystem: String,
  subjectarea: {}
});

export default exifSchema
