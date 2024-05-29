import trackSchema from "../../../schemas/trackSchema.js";
import connTrips from "./dbTrips.js";

async function deleteTrackDocument(trackid) {
  let Tracks = connTrips.model("Track", trackSchema);
  try {
    let track = await Tracks.deleteOne({_id: trackid});
    return track
  } catch (err) {
    console.log(err.message);
  }
}

export default deleteTrackDocument;