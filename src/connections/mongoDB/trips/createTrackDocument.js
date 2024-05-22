import trackSchema from "../../../schemas/trackSchema.js";
import connTrips from "./dbTrips.js";

async function createTrackDocument(id, result) {
  let Track = connTrips.model("Track", trackSchema);
  try {
    let pathObjects = result.path.map((pathObject) => {
      return {
        lat: pathObject[0],
        lon: pathObject[1],
        alt: pathObject[2],
      };
    });
    const newTrackDocument = await Track.create({
      travelid: id,
      name: result.name,
      path: pathObjects,
    });
    return newTrackDocument;
  } catch (err) {
    console.log("error happened: " + err.message);
  }
}

export default createTrackDocument;
