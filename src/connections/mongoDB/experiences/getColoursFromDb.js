import colourSchema from "../../../schemas/colourSchema.js";
import connExperiences from "./dbExperiences.js";

async function getColours() {
  let Colours = connExperiences.model("Colour", colourSchema);
  try {
    const colours = await Colours.find();
    return colours
  } catch {
    console.log(err.message);
  }
}

export default getColours;
