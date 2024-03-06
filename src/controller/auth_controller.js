import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { pool } from "../utils/db.js";

const SECRET_AUTH = process.env.SECRET_AUTH;

export const authController = {
  signUp: async (req, res) => {
    console.log(req.body);
    if (req.body?.username && req.body?.password) {
      pool
        .query("insert into private_user (name, password) values ($1, $2)", [
          req.body.username,
          bcrypt.hashSync(req.body.password, 8),
        ])
        .then((data) => res.status(201).json("User was successfully added"))
        .catch((err) => res.json({ msg: "transfer in db failed", err }));
    } else {
      res.send("No authentication information given");
    }
  },
  login: async (req, res) => {
    pool
      .query("select * from private_user where name = $1", [req.body.username])
      .then((data) => {
        const passwordIsValid = bcrypt.compareSync(
          req.body.password,
          data.rows[0].password
        );
        if (!passwordIsValid) {
          return res.status(401).json({msg: "Login failed"});
        }

        const jwtoken = jwt.sign(
          { id: data.rows[0].userid },
          SECRET_AUTH,
          {
            algorithm: "HS256",
            allowInsecureKeySizes: true,
            expiresIn: 43200, // 12 hours
          }
        );

        res
          .status(202)
          .json({ userid: data.rows[0].userid, accessToken: jwtoken });
      })
      .catch((err) => {
        console.log(err);
        res.json({ msg: "transfer in db failed", err });
      });
  },
  logout: (req, res) => {

  }
};
