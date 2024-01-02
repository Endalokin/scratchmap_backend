import "dotenv/config";
import fetchData from "../utils/fetchAPI.js";
import { pool } from "../utils/db.js";
import handleContent from "../utils/handleContent.js";

const CARBONTRACER_KEY = process.env.CARBONTRACER_KEY;

async function handleFootprint(id, body, res) {
  console.log(id);
  console.log(body);
  res.send("okay");
  /* const carbonTracerUrl = `https://api.sightengine.com/1.0/check.json?url=${imgUrl}&models=properties&api_user=${sightengine_user}&api_secret=${sightengine_secret}`;
    let result;
    await fetchData(colourUrl, (data) => {
  
      result = {
        dominantHex: data.colors.dominant.hex,
        r: data.colors.dominant.r,
        g: data.colors.dominant.g,
        b: data.colors.dominant.b
      };
      if(data.colors.accent) {
        result.accentHex = data.colors.accent[0].hex
        console.log(result)
      }
      pool
        .query("insert into Colours (imgId, imgdominantcolour, imgaccentcolour) values ($1, $2, $3)", [
          id,
          result.dominantHex,
          result.accentHex
        ])
        .then((data) => res.sendStatus(201))
        .catch((err) => res.json({ msg: "transfer in db failed", err }));
    }); */
}

export const tripController = {
  getTrips: async (req, res) => {
    res.json(await handleContent("trip"));
  },
  updateFootprintTable: async (req, res) => {
    /* console.log(req) */
    handleFootprint(req.params, req.body, res);
  },
};
