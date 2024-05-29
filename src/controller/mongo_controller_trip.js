import "dotenv/config";
import fetchData from "../utils/fetchAPI.js";
import handleContent from "../utils/mongoHandleContent.js";
import createFootprintDocument from "../connections/mongoDB/trips/createFootprintDocument.js";
import updateFootprintDocumentCompensation from "../connections/mongoDB/trips/updateFootprintDocumentCompensation.js";
import createTrackDocument from "../connections/mongoDB/trips/createTrackDocument.js";
import deleteTrackDocument from "../connections/mongoDB/trips/deleteTrackDocument.js";

const CARBONTRACER_KEY = process.env.CARBONTRACER_KEY;

async function handleFootprint(id, body, res) {
  if (body.placeDeparture == "Düsseldorf Airport") {
    body.placeDeparture = "H-2298433";
  }
  const carbonTracerUrl = `https://api.carbontracer.uni-graz.at/routing/${CARBONTRACER_KEY}/${body.vehicle}/${body.placeDeparture}/${body.placeArrival}`;
  let result;
  await fetchData(
    carbonTracerUrl,
    (data) => {
      result = {
        distanceDirect: data.response.data.distanceDirect * 2,
        distanceRoute: data.response.data.distanceRoute * 2,
        emission:
          body.vehicle == "car"
            ? (data.response.data.co2eq * 2) / body.travellers
            : data.response.data.co2eq * 2,
        amount:
          body.vehicle == "car"
            ? ((data.response.data.co2eq * 2) / body.travellers / 1000) * 30
            : ((data.response.data.co2eq * 2) / 1000) * 30,
        time: data.response.data.time,
      };

      res.status(201).json(createFootprintDocument(id, result));
    },
    "POST"
  );
}

async function getFootprintFromCarbonTracer(query, res) {
  const carbonTracerUrl = `https://api.carbontracer.uni-graz.at/routing/${CARBONTRACER_KEY}/${query.vehicle}/${query.departure}/${query.arrival}`;
  let result;
  await fetchData(carbonTracerUrl, (data) => {
    if (!data.response.success) {
      res.json({ msg: "Query failed!", errors: data.response.errors });
      return;
    }
    result = {
      distanceDirect:
        data.response.data.distanceDirect *
        (JSON.parse(query.roundtrip) ? 2 : 1),
      distanceRoute:
        data.response.data.distanceRoute *
        (JSON.parse(query.roundtrip) ? 2 : 1),
      emission:
        query.vehicle == "car"
          ? (data.response.data.co2eq * (JSON.parse(query.roundtrip) ? 2 : 1)) /
            query.travellers
          : data.response.data.co2eq * (JSON.parse(query.roundtrip) ? 2 : 1),
      amount:
        query.vehicle == "car"
          ? ((data.response.data.co2eq *
              (JSON.parse(query.roundtrip) ? 2 : 1)) /
              query.travellers /
              1000) *
            30
          : ((data.response.data.co2eq *
              (JSON.parse(query.roundtrip) ? 2 : 1)) /
              1000) *
            30,
      time: data.response.data.time,
    };
  });
  res.json(result);
}

export const tripController = {
  getTrips: async (req, res) => {
    res.json(await handleContent("trip", req.headers["x-access-token"]));
  },
  updateFootprintTable: async (req, res) => {
    handleFootprint(req.params.id, req.body, res);
  },
  updateCompensation: async (req, res) => {
    updateFootprintDocumentCompensation(req.params.id, req.query.set, res);
  },
  addTrack: async (req, res) => {
    await createTrackDocument(req.params.id, req.body);
    res.status(201).json({
      msg: "Complete",
    });
  },
  deleteTrack: async (req, res) => {
    await deleteTrackDocument(req.params.trackid);
    res.status(200).json({
      msg: "Complete",
    });
  },

  calculateNext: async (req, res) => {
    getFootprintFromCarbonTracer(req.query, res);
  },
};
