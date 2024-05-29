import footprintSchema from "../../../schemas/footprintSchema.js"
import connTrips from "./dbTrips.js";

async function createFootprintDocument(id, result) {
  let Footprint = connTrips.model("Footprint", footprintSchema);
  try {
    const newFootprintDocument = await Footprint.create({
      travelid: id,
      distance: result.distanceRoute,
      emission: result.emission,
      amount: result.amount,
      compensated: false,
    });
    return newFootprintDocument;
  } catch (err) {
    console.log("error happened: " + err.message);
  }
}

export default createFootprintDocument;
