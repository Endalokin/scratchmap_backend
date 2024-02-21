import "dotenv/config";
import fetchData from "../utils/fetchAPI.js";
import { pool } from "../utils/db.js";

const space_id = process.env.CONTENTFUL_SPACE_ID;

async function handleContent(content_type, user) {
  let  subdomain
  let access_token = process.env.CONTENTFUL_ACCESS_TOKEN;
  if (user) {
    subdomain = "preview"
    access_token = process.env.CONTENTFUL_ACCESS_TOKEN_DRAFT;
  } else {
    subdomain = "cdn"
    access_token = process.env.CONTENTFUL_ACCESS_TOKEN;
  }
  const url = `https://${subdomain}.contentful.com/spaces/${space_id}/entries?access_token=${access_token}&content_type=${content_type}&include=3`;
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
      const imgDB = pgTable.find((c) => {
        return i.fields.image.sys.id == c.imgid;
      });
      if (imgDB) {
        return {
          id: i.sys.id,
          ...i.fields,
          imgUrl: imgUrl,
          imgColour: imgDB.imgdominantcolour,
          imgAccentColour: imgDB.imgaccentcolour,
          exif: {
            dateTime: imgDB.datetime,
            offsetTime: imgDB.offsettime,
            lat: imgDB.lat,
            lon: imgDB.lon,
            altitude: imgDB.altitude,
            direction: imgDB.direction,
            positioningError: imgDB.positioningerror,
            coordSystem: imgDB.coordsystem,
            subjectArea: imgDB.subjectarea,
          }
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
    .query("select * from Colours full join exif on Colours.imgid = exif.imgid")
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
