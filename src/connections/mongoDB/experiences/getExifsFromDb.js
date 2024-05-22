import exifSchema from "../../../schemas/exifSchema.js";
import connExperiences from "./dbExperiences.js";

async function getExifs() {
  let Exifs = connExperiences.model("Exif", exifSchema);
  try {
    const exifs = await Exifs.find();
    return exifs
  } catch {
    console.log(err.message);
  }
}

export default getExifs;
