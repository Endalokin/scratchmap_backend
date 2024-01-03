import "dotenv/config";
import fetchData from "../utils/fetchAPI.js";
import { pool } from "../utils/db.js";
import handleContent from "../utils/handleContent.js";

const space_id = process.env.CONTENTFUL_SPACE_ID;
const access_token = process.env.CONTENTFUL_ACCESS_TOKEN;
const sightengine_user = process.env.SIGHTENGINE_USER;
const sightengine_secret = process.env.SIGHTENGINE_SECRET;



async function handleColour(imgUrl, id, res) {
  const colourUrl = `https://api.sightengine.com/1.0/check.json?url=${imgUrl}&models=properties&api_user=${sightengine_user}&api_secret=${sightengine_secret}`;
  let result;
  await fetchData(colourUrl, (data) => {
    result = {
      dominantHex: data.colors.dominant.hex,
      r: data.colors.dominant.r,
      g: data.colors.dominant.g,
      b: data.colors.dominant.b,
    };
    if (data.colors.accent) {
      result.accentHex = data.colors.accent[0].hex;
    }
    pool
      .query(
        "insert into Colours (imgId, imgdominantcolour, imgaccentcolour) values ($1, $2, $3)",
        [id, result.dominantHex, result.accentHex]
      )
      .then((data) => res.sendStatus(201))
      .catch((err) => res.json({ msg: "transfer in db failed", err }));
  }, "POST");
}

export const experienceController = {
  postColour: (req, res) => {
    handleColour(req.query.url, req.query.id, res);
  },
  getExperiences: async (req, res) => {
    res.json(await handleContent("experience"));
  },
};
