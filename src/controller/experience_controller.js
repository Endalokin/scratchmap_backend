import "dotenv/config";
import fetchData from "../utils/fetchAPI.js";
import { pool } from "../utils/db.js";
import handleContent from "../utils/handleContent.js";
import ExifReader from "exifreader";

const sightengine_user = process.env.SIGHTENGINE_USER;
const sightengine_secret = process.env.SIGHTENGINE_SECRET;

async function handleColour(imgUrl, id) {
  console.log("This is Colours");
  const colourUrl = `https://api.sightengine.com/1.0/check.json?url=${imgUrl}?w=3500&models=properties&api_user=${sightengine_user}&api_secret=${sightengine_secret}`;
  let result = {};
  await fetchData(
    colourUrl,
    (data) => {
      result = {
        dominantHex: data.colors.dominant.hex,
        r: data.colors.dominant.r,
        g: data.colors.dominant.g,
        b: data.colors.dominant.b,
      };
      if (data.colors.accent) {
        result["accentHex"] = data.colors.accent[0].hex;
      }
    },
    "GET"
  );
  return await pool
    .query(
      "INSERT INTO Colours (imgId, imgdominantcolour, imgaccentcolour) VALUES ($1, $2, $3)",
      [id, result.dominantHex, result.accentHex]
    )
    .then((data) => `Colours transfer in db succeeded?`)
    .catch((err) => `Exif transfer in db failed: ${err}`);
}

function formatExifDate(result) {
  let timestamp;
  if (result.DateTimeOriginal?.description[4] == ":") {
    timestamp =
      result.DateTimeOriginal?.description.split(" ")[0].replaceAll(":", "-") +
      " " +
      result.DateTimeOriginal?.description.split(" ")[1];
  } else {
    timestamp = result.DateTimeOriginal?.description;
  }
  return timestamp;
}

export function formatExifAltitude(result) {
  let altitude;
  if (result.GPSAltitude?.description.includes("/")) {
    let number = result.GPSAltitude?.description.split(" ")[0].split("/");
    altitude = number[0] / number[1];
  } else {
    altitude = result.GPSAltitude?.description.split(" ")[0];
  }
  return parseFloat(altitude);
}

export function formatExifLocation(result) {
  let location = { lon: 0, lat: 0 };
  if (result.GPSLongitudeRef?.value[0] == "W") {
    location.lon -= result.GPSLongitude?.description;
  } else {
    location.lon += result.GPSLongitude?.description;
  }

  if (result.GPSLatitudeRef?.value[0] == "S") {
    location.lat -= result.GPSLatitude?.description;
  } else {
    location.lat += result.GPSLatitude?.description;
  }
  return location;
}

async function handleExif(imgUrl, id) {
  console.log("This is Exif");
  const result = await ExifReader.load(imgUrl);

  let timestamp = formatExifDate(result);
  let altitude = formatExifAltitude(result);
  let location = formatExifLocation(result);

  return await pool
    .query(
      "INSERT INTO exif VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      [
        id,
        timestamp,
        result.OffsetTimeOriginal?.description,
        location.lat,
        location.lon,
        altitude,
        result.GPSImgDirection?.description,
        result.GPSHPositioningError?.description,
        result.GPSMapDatum?.description,
        result.SubjectArea,
      ]
    )
    .then((data) => `Exif transfer in db succeeded?`)
    .catch((err) => `Exif transfer in db failed: ${err}`);
}

export const experienceController = {
  updateImgData: async (req, res) => {
    console.log("updateImgData is accessed");
    let colourMessages = {};
    let exifMessages = {};
    for (let image of req.body.experiencesNeedUpdate) {
      if (image.updateColour) {
        colourMessages[image.id] = await handleColour(image.url, image.id);
      }
      if (image.updateExif) {
        exifMessages[image.id] = await handleExif(image.url, image.id);
      }
    }
    res
      .status(201)
      .json({ exifMessages: exifMessages, colourMessages: colourMessages });
  },
  getExperiences: async (req, res) => {
    res.json(await handleContent("experience", req.query.user));
  },
};
