import colourSchema from "../../../schemas/colourSchema.js";
import connExperiences from "./dbExperiences.js";

async function createColourDocument(id, data) {
  let Colour = connExperiences.model("Colour", colourSchema);
  try {
    const newColourDocument = await Colour.create({
      imgid: id,
      imgdominantcolour: data.colors.dominant.hex,
      imgaccentcolour: data.colors.accent && data.colors.accent[0].hex,
    });
    return `Colours transfer in db succeeded for ${newColourDocument}`;
  } catch (err) {
    `Colour transfer in db failed: ${err}`;
  }
}

export default createColourDocument;
