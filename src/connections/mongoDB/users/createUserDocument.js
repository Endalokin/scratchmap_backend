import userSchema from "../../../schemas/userSchema.js";
import connUsers from "./dbUsers.js";
import bcrypt from "bcryptjs";

async function createUserDocument(data) {
  let User = connUsers.model("User", userSchema);
  try {
    const newUserDocument = await User.create({
      name: data.username,
      password: bcrypt.hashSync(data.password, 8)
    });
    return `User transfer in db succeeded for ${newUserDocument.name}`;
  } catch (err) {
    `User transfer in db failed: ${err}`;
  }
}

export default createUserDocument;
