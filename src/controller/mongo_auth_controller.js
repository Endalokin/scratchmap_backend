import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import createUserDocument from "../connections/mongoDB/users/createUserDocument.js";
import getSingleUser from "../connections/mongoDB/users/getSingleUser.js";

const SECRET_AUTH = process.env.SECRET_AUTH;

export const authController = {
  signUp: async (req, res) => {
    if (req.body?.username && req.body?.password) {
      res.status(201).json(await createUserDocument(req.body));
    } else {
      res.send("No authentication information given");
    }
  },
  login: async (req, res) => {
    const user = await getSingleUser(req.body.username)
    if (!user) {
      return res.status(401).json({ msg: "Login failed"});
    }
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).json({msg: "Login failed"});
    }

    const jwtoken = jwt.sign(
      { id: user._id },
      SECRET_AUTH,
      {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 43200, // 12 hours
      }
    );

    res
      .status(202)
      .json({ userid: user._id, accessToken: jwtoken });
  }
};
