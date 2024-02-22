import {
  formatExifAltitude,
  formatExifLocation,
} from "./experience_controller.js";

test("Altitude is formatted", () => {
  const expectedFormat = 560.198547215496;

  let altitude1 = {
    GPSAltitude: {
      description: "560.198547215496 m",
    },
  };

  let altitude2 = {
    GPSAltitude: {
      description: "560.198547215496/1",
    },
  };

  const actualFormatA1 = formatExifAltitude(altitude1);
  const actualFormatA2 = formatExifAltitude(altitude2);

  expect(actualFormatA1).toBe(expectedFormat);
  expect(actualFormatA2).toBe(expectedFormat);
});

test("Location is formatted", () => {
  const expectedFormatSW = { lon: -15.078639, lat: -65.333028 };
  const expectedFormatSE = { lon: 15.078639, lat: -65.333028 };
  const expectedFormatNE = { lon: 15.078639, lat: 65.333028 };
  const expectedFormatNW = { lon: -15.078639, lat: 65.333028 };

  let locationSW = {
    GPSLongitudeRef: {
      value: ["W"],
    },
    GPSLatitudeRef: {
      value: ["S"],
    },
    GPSLongitude: {
      description: 15.078639,
    },
    GPSLatitude: {
      description: 65.333028,
    },
  };
  let locationSE = {
    GPSLongitudeRef: {
      value: ["E"],
    },
    GPSLatitudeRef: {
      value: ["S"],
    },
    GPSLongitude: {
      description: 15.078639,
    },
    GPSLatitude: {
      description: 65.333028,
    },
  };
  let locationNE = {
    GPSLongitudeRef: {
      value: ["E"],
    },
    GPSLatitudeRef: {
      value: ["N"],
    },
    GPSLongitude: {
      description: 15.078639,
    },
    GPSLatitude: {
      description: 65.333028,
    },
  };
  let locationNW = {
    GPSLongitudeRef: {
      value: ["W"],
    },
    GPSLatitudeRef: {
      value: ["N"],
    },
    GPSLongitude: {
      description: 15.078639,
    },
    GPSLatitude: {
      description: 65.333028,
    },
  };

  const actualFormatSW = formatExifLocation(locationSW);
  const actualFormatSE = formatExifLocation(locationSE);
  const actualFormatNE = formatExifLocation(locationNE);
  const actualFormatNW = formatExifLocation(locationNW);

  expect(actualFormatSW).toEqual(expectedFormatSW);
  expect(actualFormatSE).toEqual(expectedFormatSE);
  expect(actualFormatNE).toEqual(expectedFormatNE);
  expect(actualFormatNW).toEqual(expectedFormatNW);
});
