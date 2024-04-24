import "dotenv/config";
import fetchData from "../utils/fetchAPI.js";
import { pool } from "../utils/db.js";
import jwt from "jsonwebtoken";

const space_id = process.env.CONTENTFUL_SPACE_ID;
const SECRET_AUTH = process.env.SECRET_AUTH;

async function handleContent(content_type, token) {
  let subdomain;
  let access_token = process.env.CONTENTFUL_ACCESS_TOKEN;

  if (token) {
    jwt.verify(token, SECRET_AUTH, (err, decoded) => {
      if (err) {
        subdomain = "cdn";
        access_token = process.env.CONTENTFUL_ACCESS_TOKEN;
      } else {
        subdomain = "preview";
        access_token = process.env.CONTENTFUL_ACCESS_TOKEN_DRAFT;
      }
    });
  } else {
    subdomain = "cdn";
    access_token = process.env.CONTENTFUL_ACCESS_TOKEN;
  }
  const url = `https://${subdomain}.contentful.com/spaces/${space_id}/entries?access_token=${access_token}&content_type=${content_type}&include=3`;
  let result;
  let allData;
  let pgColourTable;
  let pgFootprintTable;
  let pgTrackTable;
  await fetchData(url, (data) => {
    allData = data;
  });

  if (content_type == "experience") {
    pgColourTable = await getColourFromDB();
  } else {
    pgFootprintTable = await getFootprintFromDB();
    pgTrackTable = await getTracksFromDB();
  }

  return (result = await allData.items.map((i) => {
    if (content_type == "experience") {
      const img = allData.includes.Asset.find(
        (a) => i.fields.image.sys.id == a.sys.id
      );
      const imgUrl = `https:${img.fields.file.url}`;
      const imgDB = pgColourTable.find((c) => {
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
          },
        };
      } else {
        return {
          id: i.sys.id,
          ...i.fields,
          imgUrl: imgUrl,
        };
      }
    } else {
      const footprint = pgFootprintTable.find((c) => {
        return i.sys.id == c.travelid;
      });
      let tracks = pgTrackTable.filter((c) => {
        return i.sys.id == c.travelid;
      })

      tracks = tracks.map((t) => {
        let pathArray = t.path.replaceAll("(", "[")
        pathArray = pathArray?.replaceAll(")", "]")
        return {
          id: t.trackid,
          name: t.name,
          path: JSON.parse(pathArray),
          altitude: t.altitude
        }
      })

      return {
        id: i.sys.id,
        ...i.fields,
        footprint: footprint,
        tracks: tracks
      };
    }
  }));
}

async function getColourFromDB() {
  return await pool
    .query("select * from Colours full join exif on Colours.imgid = exif.imgid")
    .then((data) => {
      return data.rows;
    })
    .catch((err) => console.log({ msg: "select from db failed", err }));
}

async function getFootprintFromDB() {
  return await pool
    .query("select * from Footprint")
    .then((data) => {
      return data.rows;
    })
    .catch((err) => console.log({ msg: "select from db failed", err }));
}

async function getTracksFromDB() {
  return await pool
    .query("select * from Tracks")
    .then((data) => {
      return data.rows;
    })
    .catch((err) => console.log({ msg: "select from db failed", err }));
}

export default handleContent;
