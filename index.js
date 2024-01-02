import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import bodyParser from 'body-parser'
import contentfulRouter from "./src/router/contentful_router.js"
import pgRouter from "./src/router/pg_router.js"
import experienceRouter from "./src/router/experience_router.js"
import tripRouter from "./src/router/trip_router.js"

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.get("/test", (req, res) => {
    res.json({msg: `This is a test you got from the server. Hello ${process.env.SECRET_TEST}!`})
})

app.use("/contentful", contentfulRouter)
app.use("/pg", pgRouter)
app.use("/experiences", experienceRouter)
app.use("/trips", tripRouter)

app.listen(8080, () => console.log("listening on 8080"))