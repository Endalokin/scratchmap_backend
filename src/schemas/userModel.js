import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: { type: String, required: true },
  age: Number,
  hobbies: [String],
  address: {
    street: String,
    city: String,
  },
  bestFriend: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  active: Boolean
});

export default mongoose.model("User", userSchema);
// -> User wird für MongoDB in plural und kleingeschrieben umgewandelt und wird demzufolge zu der Collection "users"
