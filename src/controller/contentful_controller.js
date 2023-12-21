import "dotenv/config";
import fetchData from "../utils/fetchAPI.js";

const space_id = process.env.CONTENTFUL_SPACE_ID;
const access_token = process.env.CONTENTFUL_ACCESS_TOKEN;
const sightengine_user = process.env.SIGHTENGINE_USER;
const sightengine_secret = process.env.SIGHTENGINE_SECRET;

async function handleContent(content_type) {
  const url = `https://cdn.contentful.com/spaces/${space_id}/entries?access_token=${access_token}&content_type=${content_type}`;
  let result
  await fetchData(url, (data) => {
    result = data.items.map((i) => {
      return { id: i.sys.id, ...i.fields };
    });
  });
  return result
}

async function handleImages() {
  const url = `https://cdn.contentful.com/spaces/${space_id}/assets?access_token=${access_token}`;
  let result
  await fetchData(url, (data) => {
    result = (data.items.map((i) => `https:${i.fields.file.url}`));
  });
  return result
}

async function handleImage(asset_id) {
  const url = `https://cdn.contentful.com/spaces/${space_id}/assets/${asset_id}?access_token=${access_token}`;
  let result
  await fetchData(url, (data) => {
    result = data;
  });
  return result
}

async function handleColour(imgUrl) {
  const colourUrl = `https://api.sightengine.com/1.0/check.json?url=${imgUrl}&models=properties&api_user=${sightengine_user}&api_secret=${sightengine_secret}`
  let result
  await fetchData(colourUrl, (data) => {
    result = data.colors.dominant.hex
  })
  return result
}

export const contentfulController = {
  getTrips: async (req, res) => {
    res.json(await handleContent("trip"))
  },
  getExperiences: async (req, res) => {
    res.json(await handleContent("experience"))
  },

  getImages: async (req, res) => {
    res.json(await handleImages())
  },

  getExperiencesImgColoured: async (req, res) => {
    const experiences = await handleContent("experience")
    let result = []
    for (let e of experiences) {
      const img = await handleImage(e.image.sys.id)
      e.image.imgUrl = img.fields.file.url
      e.image.imgColour = await handleColour(`https:${e.image.imgUrl}`)
      result.push(e)
    }
    res.json(result)
  },

  getColour: (req, res) => {
    const imgUrl = `http://images.ctfassets.net/q0wjbbqqoctx/6r9CWxa8KrJGAQ3tZJRGXA/d1c81f7b8a28a8635da9a7033fb80364/DSC04208.JPG`
    const colourUrl = `https://api.sightengine.com/1.0/check.json?url=${imgUrl}&models=properties&api_user=${sightengine_user}&api_secret=${sightengine_secret}`
    fetchData(colourUrl, (data) => {
      res.json(data)
    })
  }
};
