import mongoose from "mongoose";

const footprintSchema = new mongoose.Schema({
    travelid: {type: String, required: true},
    distance: Number,
    emission: Number,
    amount: Number,
    compensated: Boolean
});

export default footprintSchema
