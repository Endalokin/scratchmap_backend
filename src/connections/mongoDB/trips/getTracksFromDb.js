import trackSchema from "../../../schemas/trackSchema.js";
import connTrips from "./dbTrips.js";

async function getTracks() {
  let Tracks = connTrips.model("Track", trackSchema);
  try {
    const tracks = await Tracks.find();
    return tracks
  } catch (err) {
    console.log(err.message);
  }
}

export default getTracks;
