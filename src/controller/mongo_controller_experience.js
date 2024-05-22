import "dotenv/config";
import fetchData from "../utils/fetchAPI.js";
import handleContent from "../utils/mongoHandleContent.js";
import ExifReader from "exifreader";
import createColourDocument from "../connections/mongoDB/experiences/createColourDocument.js";
import createExifDocument from "../connections/mongoDB/experiences/createExifDocument.js";

const sightengine_user = process.env.SIGHTENGINE_USER;
const sightengine_secret = process.env.SIGHTENGINE_SECRET;

async function handleColour(imgUrl, id) {
  const colourUrl = `https://api.sightengine.com/1.0/check.json?url=${imgUrl}?w=3500&models=properties&api_user=${sightengine_user}&api_secret=${sightengine_secret}`;
  return await fetchData(
    colourUrl,
    async (data) => {
      return await createColourDocument(id, data);
    },
    "GET"
  );
}

async function handleExif(imgUrl, id) {
  const result = await ExifReader.load(imgUrl);
  return await createExifDocument(id, result)
}

export const experienceController = {
  updateImgData: async (req, res) => {
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
    res.json(await handleContent("experience", req.headers["x-access-token"]));
  },
};
