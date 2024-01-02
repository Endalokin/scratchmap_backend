import "dotenv/config";
import fetchData from "../utils/fetchAPI.js";
import { pool } from "../utils/db.js";

const space_id = process.env.CONTENTFUL_SPACE_ID;
const access_token = process.env.CONTENTFUL_ACCESS_TOKEN;
const sightengine_user = process.env.SIGHTENGINE_USER;
const sightengine_secret = process.env.SIGHTENGINE_SECRET;

async function handleContent(content_type) {
    const url = `https://cdn.contentful.com/spaces/${space_id}/entries?access_token=${access_token}&content_type=${content_type}&include=3`;
    let result;
    let allData;
    let pgTable;
    await fetchData(url, (data) => {
      allData = data;
    });
  
    if (content_type == "experience") {
      await pool
        .query("select * from Colours")
        .then((data) => {
          pgTable = data.rows;
        })
        .catch((err) => console.log({ msg: "select from db failed", err }));
    } else {
      console.log("pool for footprint can be done");
    }
  
    return (result = await allData.items.map((i) => {
      if (content_type == "experience") {
        const img = allData.includes.Asset.find(
          (a) => i.fields.image.sys.id == a.sys.id
        );
        const imgUrl = `https:${img.fields.file.url}`;
        const imgColour = pgTable.find((c) => {
          return i.fields.image.sys.id == c.imgid;
        });
        if (imgColour) {
          return {
            id: i.sys.id,
            ...i.fields,
            imgUrl: imgUrl,
            imgColour: imgColour.imgdominantcolour,
            imgAccentColour: imgColour.imgaccentcolour,
          };
        } else {
          return {
            id: i.sys.id,
            ...i.fields,
            imgUrl: imgUrl,
          };
        }
      }
      return {
        id: i.sys.id,
        ...i.fields,
      };
    }));
  }

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
  });
}

export const experienceController = {
  postColour: (req, res) => {
    handleColour(req.query.url, req.query.id, res);
  },
  getExperiences: async (req, res) => {
    res.json(await handleContent("experience"));
  },
};
