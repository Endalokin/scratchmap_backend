import "dotenv/config";
import fetchData from "../utils/fetchAPI.js";
import { pool } from "../utils/db.js";

const space_id = process.env.CONTENTFUL_SPACE_ID;
const access_token = process.env.CONTENTFUL_ACCESS_TOKEN;

async function handleContent(content_type) {
  const url = `https://cdn.contentful.com/spaces/${space_id}/entries?access_token=${access_token}&content_type=${content_type}&include=3`;
  let result;
  let allData;
  let pgTable;
  await fetchData(url, (data) => {
    allData = data;
  });

  if (content_type == "experience") {
    pgTable = await getColourFromDB(pgTable);
  } else {
    pgTable = await getFootprintFromDB(pgTable);
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
    } else {
      const footprint = pgTable.find((c) => {
        return i.sys.id == c.travelid;
      });
      return {
        id: i.sys.id,
        ...i.fields,
        footprint: footprint,
      };
    }
  }));
}

async function getColourFromDB(pgTable) {
  await pool
    .query("select * from Colours")
    .then((data) => {
      pgTable = data.rows;
    })
    .catch((err) => console.log({ msg: "select from db failed", err }));
  return pgTable;
}

async function getFootprintFromDB(pgTable) {
  await pool
    .query("select * from Footprint")
    .then((data) => {
      pgTable = data.rows;
    })
    .catch((err) => console.log({ msg: "select from db failed", err }));
  return pgTable;
}

export default handleContent;
