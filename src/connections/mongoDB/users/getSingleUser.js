import userSchema from "../../../schemas/userSchema.js";
import connUsers from "./dbUsers.js";

async function getSingleUser(username) {
  let Users = connUsers.model("User", userSchema);
  try {
    const user = await Users.findOne({name: username});
    return user
  } catch (err) {
    console.log(err.message);
  }
}

export default getSingleUser;