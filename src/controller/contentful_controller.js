import "dotenv/config";
import fetchData from "../utils/fetchAPI.js";

const space_id = process.env.CONTENTFUL_SPACE_ID;
const access_token = process.env.CONTENTFUL_ACCESS_TOKEN;

function getEntriesByType(type) {}

export const contentfulController = {
  getTrips: (req, res) => {
    let content_type = "trip";
    const url = `https://cdn.contentful.com/spaces/${space_id}/entries?access_token=${access_token}&content_type=${content_type}`;
    const data = fetchData(url, (data) => {
      res.json(data.items.map((i) => i.fields));
    });
  },
  getExperiences: (req, res) => {
    let content_type = "experience";
    const url = `https://cdn.contentful.com/spaces/${space_id}/entries?access_token=${access_token}&content_type=${content_type}`;
    fetchData(url, (data) => {
      console.log(data.items);
      res.json(
        data.items.map((i) => {
          return { id: i.sys.id, ...i.fields };
        })
      );
    });
  },
  getImages: (req, res) => {
    const url = `https://cdn.contentful.com/spaces/${space_id}/assets?access_token=${access_token}`;
    const data = fetchData(url, (data) => {
      res.json(data.items.map((i) => `https:${i.fields.file.url}`));
    });
  },
};
