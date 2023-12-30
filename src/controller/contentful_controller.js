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

async function handleImages() {
  const url = `https://cdn.contentful.com/spaces/${space_id}/assets?access_token=${access_token}`;
  let result;
  await fetchData(url, (data) => {
    result = data.items.map((i) => `https:${i.fields.file.url}`);
  });
  return result;
}

async function handleImage(asset_id) {
  const url = `https://cdn.contentful.com/spaces/${space_id}/assets/${asset_id}?access_token=${access_token}`;
  let result;
  await fetchData(url, (data) => {
    result = data;
  });
  return result;
}

async function handleColour(imgUrl, id, res) {
  console.log(imgUrl, id)
  const colourUrl = `https://api.sightengine.com/1.0/check.json?url=${imgUrl}&models=properties&api_user=${sightengine_user}&api_secret=${sightengine_secret}`;
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
  });
}

export const contentfulController = {
  getTrips: async (req, res) => {
    res.json(await handleContent("trip"));
  },
  getExperiences: async (req, res) => {
    res.json(await handleContent("experience"));
  },

  getImages: async (req, res) => {
    res.json(await handleImages());
  },

  getExperiencesImgColoured: async (req, res) => {
    const experiences = await handleContent("experience");
    let result = [];
    for (let e of experiences) {
      const img = await handleImage(e.image.sys.id);
      e.image.imgUrl = img.fields.file.url;
      e.image.imgColour = await handleColour(`https:${e.image.imgUrl}`);
      result.push(e);
    }
    res.json(result);
  },

  getColour: (req, res) => {
    console.log(req.query);
    const imgUrl = `http://images.ctfassets.net/q0wjbbqqoctx/6r9CWxa8KrJGAQ3tZJRGXA/d1c81f7b8a28a8635da9a7033fb80364/DSC04208.JPG`;
    const colourUrl = `https://api.sightengine.com/1.0/check.json?url=${imgUrl}&models=properties&api_user=${sightengine_user}&api_secret=${sightengine_secret}`;
    fetchData(colourUrl, (data) => {
      res.json(data);
    });
  },
  postColour: (req, res) => {
    handleColour(req.query.url, req.query.id, res);
  },
};
