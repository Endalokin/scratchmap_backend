import footprintSchema from "../../../schemas/footprintSchema.js";
import connTrips from "./dbTrips.js";

async function getFootprint() {
  let Footprint = connTrips.model("Footprint", footprintSchema);
  try {
    const footprints = await Footprint.find();
    return footprints
  } catch (err) {
    console.log(err.message);
  }
}

export default getFootprint;
