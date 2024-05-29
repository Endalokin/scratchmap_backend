import footprintSchema from "../../../schemas/footprintSchema.js";
import connTrips from "./dbTrips.js";

async function updateFootprintDocumentCompensation(id, set, res) {
  let Footprint = connTrips.model("Footprint", footprintSchema);
  try {
    const user = await Footprint.find({ travelid: id });
    user[0].compensated = set;
    user[0].save();
    res.status(201).json({ msg: "Complete" });
  } catch (err) {
    res.json({ msg: "transfer in db failed", err });
  }
}

export default updateFootprintDocumentCompensation;
