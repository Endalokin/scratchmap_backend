import mongoose from "mongoose";
import express from "express";
import User from "../schemas/userModel.js";
import Guest from "../schemas/guestModel.js";

/* await mongoose.connect(process.env.MONGO_DB_URI); */

const router = express.Router();

async function getGuest() {
  try {
    const guests = await Guest.find();
    console.log(guests)
  } catch {
    console.log(err.message);
  }
}

router.get("/guests", (req, res) => {
    getGuest();
    res.send("user created");
  });

async function getUser() {
  try {
    const users = await User.find();
    // folgende Abfrage würde den bestFriend nicht nur als ID anzeigen sondern auch mit all seinen Werten im Objekt anzeigen
    //return await User.findById("656867b43058c679878d9c55").populate("bestFriend")
    //folgende Abfrage mit where-clause
    /*     const users = await User.find()
      .where("first_name")
      .equals("Peter")
      .where("age")
      .gt(30); */
    console.log(users);
  } catch {
    console.log(err.message);
  }
}

router.get("/alluser", (req, res) => {
  getUser();
  res.send("user created");
});

export default router;
