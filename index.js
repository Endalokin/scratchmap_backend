import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import bodyParser from 'body-parser'
import experienceRouter from "./src/router/experience_router.js"
import tripRouter from "./src/router/trip_router.js"
import authRouter from "./src/router/auth_router.js"
import fs from 'fs';
import { pool } from './src/utils/db.js'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

const html = fs.readFileSync('index.html','utf8')
app.get('/',(req,res)=>res.type('html').send(html));

app.get("/test", (req, res) => {
    res.json({msg: `This is a test you got from the server. Hello ${process.env.SECRET_TEST}!`})
})

// This will be deprecated as soon as user route is done
app.post("/login", (req, res) => {
    pool
        .query(
          "select * from private_user where name = $1 and password = $2",
          [req.body.username, req.body.password]
        )
        .then((data) => {
            res.status(202).json({userid: data.rows[0].userid})
        })
        .catch((err) => res.json({ msg: "transfer in db failed", err }));
})

app.use("/user", authRouter)
app.use("/experiences", experienceRouter)
app.use("/trips", tripRouter)

app.listen(8080, () => console.log("listening on 8080"))