import "dotenv/config";
import fetchData from "./fetchAPI.js";
import jwt from "jsonwebtoken";
import getFootprintFromDB from "../connections/mongoDB/trips/getFootprintFromDb.js";
import getTracksFromDB from "../connections/mongoDB/trips/getTracksFromDb.js";
import getColours from "../connections/mongoDB/experiences/getColoursFromDb.js";
import getExifs from "../connections/mongoDB/experiences/getExifsFromDb.js";

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
  let allData;
  let pgColourTable;
  let pgExifTable;
  let pgFootprintTable;
  let pgTrackTable;
  await fetchData(url, (data) => {
    allData = data;
  });

  if (content_type == "experience") {
    pgColourTable = await getColours();
    pgExifTable = await getExifs();
  } else {
    pgFootprintTable = await getFootprintFromDB();
    pgTrackTable = await getTracksFromDB();
  }

  return await allData.items.map((item) => {
    if (content_type == "experience") {
      const img = allData.includes.Asset.find(
        (asset) => item.fields.image.sys.id == asset.sys.id
      );
      const imgUrl = `https:${img.fields.file.url}`;
      const imgDB = pgColourTable.find((colourDocument) => {
        return item.fields.image.sys.id == colourDocument.imgid;
      });
      const exifDB = pgExifTable.find((exifDocument) => {
        return item.fields.image.sys.id == exifDocument.imgid;
      });
      let experienceObject = {
        id: item.sys.id,
        ...item.fields,
        imgUrl: imgUrl,
      };
      if (imgDB) {
        (experienceObject.imgColour = imgDB.imgdominantcolour),
          (experienceObject.imgAccentColour = imgDB.imgaccentcolour);
      }
      if (exifDB) {
        experienceObject.exif = {
          dateTime: exifDB?.datetime,
          offsetTime: exifDB?.offsettime,
          lat: exifDB?.lat,
          lon: exifDB?.lon,
          altitude: exifDB?.altitude,
          direction: exifDB?.direction,
          positioningError: exifDB?.positioningerror,
          coordSystem: exifDB?.coordsystem,
          subjectArea: exifDB?.subjectarea,
        };
      }
      return experienceObject;
    } else {
      const footprint = pgFootprintTable.find((footprintDocument) => {
        return item.sys.id == footprintDocument.travelid;
      });
      let tracks = pgTrackTable.filter((trackDocument) => {
        return item.sys.id == trackDocument.travelid;
      });

      return {
        id: item.sys.id,
        ...item.fields,
        footprint: footprint,
        tracks: tracks,
      };
    }
  });
}

export default handleContent;
