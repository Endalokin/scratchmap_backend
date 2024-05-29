import exifSchema from "../../../schemas/exifSchema.js";
import connExperiences from "./dbExperiences.js";

function formatExifDate(result) {
    let timestamp;
    if (result.DateTimeOriginal?.description[4] == ":") {
      timestamp =
        result.DateTimeOriginal?.description.split(" ")[0].replaceAll(":", "-") +
        " " +
        result.DateTimeOriginal?.description.split(" ")[1];
    } else {
      timestamp = result.DateTimeOriginal?.description;
    }
    return timestamp;
  }

export function formatExifAltitude(result) {
    let altitude;
    if (result.GPSAltitude?.description.includes("/")) {
      let number = result.GPSAltitude?.description.split(" ")[0].split("/");
      altitude = number[0] / number[1];
    } else {
      altitude = result.GPSAltitude?.description.split(" ")[0];
    }
    return parseFloat(altitude);
  }
  
  export function formatExifLocation(result) {
    let location = { lon: 0, lat: 0 };
    if (result.GPSLongitudeRef?.value[0] == "W") {
      location.lon -= result.GPSLongitude?.description;
    } else {
      location.lon += result.GPSLongitude?.description;
    }
  
    if (result.GPSLatitudeRef?.value[0] == "S") {
      location.lat -= result.GPSLatitude?.description;
    } else {
      location.lat += result.GPSLatitude?.description;
    }
    return location;
  }

async function createExifDocument(id, data) {
  let timestamp = formatExifDate(data);
  let altitude = formatExifAltitude(data);
  let location = formatExifLocation(data);

  let Exif = connExperiences.model("Exif", exifSchema);
  try {
    const newExifDocument = await Exif.create({
        imgid: id,
        datetime: timestamp,
        offsettime: data.OffsetTimeOriginal?.description,
        lat: location.lat,
        lon: location.lon,
        altitude: altitude,
        direction: data.GPSImgDirection?.description,
        positioningerror: data.GPSHPositioningError?.description,
        coordsystem: data.GPSMapDatum?.description,
        subjectarea: data.SubjectArea  
    });
    return `Exif transfer in db succeeded for ${newExifDocument}`;
  } catch (err) {
    return `Exif transfer in db failed: ${err}`;
  }
}

export default createExifDocument;
