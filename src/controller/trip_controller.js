import "dotenv/config";
import fetchData from "../utils/fetchAPI.js";
import { pool } from "../utils/db.js";
import handleContent from "../utils/handleContent.js";

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
      pool
        .query(
          "insert into footprint (travelid, distance, emission, amount, compensated, time) values ($1, $2, $3, $4, $5, $6)",
          [
            id,
            result.distanceRoute,
            result.emission,
            result.amount,
            false,
            result.time,
          ]
        )
        .then((data) => res.status(201).json(result))
        .catch((err) => res.json({ msg: "transfer in db failed", err }));
    },
    "POST"
  );
}

export const tripController = {
  getTrips: async (req, res) => {
    res.json(await handleContent("trip", req.query.user));
  },
  updateFootprintTable: async (req, res) => {
    handleFootprint(req.params.id, req.body, res);
  },
  updateCompensation: async (req, res) => {
    pool
      .query("UPDATE footprint SET compensated=$1 WHERE travelid=$2", [
        req.query.set,
        req.params.id,
      ])
      .then((data) => res.status(201).json({msg: "Complete", command: data.command, rowCount: data.rowCount }))
      .catch((err) => res.json({ msg: "transfer in db failed", err }));
  },
};
