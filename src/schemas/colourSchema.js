import mongoose from "mongoose";

const colourSchema = new mongoose.Schema({
  imgid: {type: String, required: true},
  imgdominantcolour: String,
  imgaccentcolour: String
});

export default colourSchema
