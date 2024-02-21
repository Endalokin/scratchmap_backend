# ScratchMap Backend

## Frontend

This repository works as a backend to provide data for the frontend application ScratchMap. Please visit its repository for demonstration and to get a better impression of what the data is used for:

https://github.com/Endalokin/scratchmap_frontend

## Routes

Please visit https://scratchmap-backend.onrender.com/ for a description of all available routes.

## Additional Content Delivery Applications

### Contentful

1. Create yourself a Contenful account on https://www.contentful.com/
2. Create a content model for trips: 
3. Create a content model for experiences: 
4. Add trips and experiences with images as desired.

> [!NOTE] 
> Content model specification will be added soon

### Postgresql Database

1. Create yourself an ElephantSQL account on https://www.elephantsql.com/ (probably also other db works)
2. Create a table footprint: 
3. Create a table colours: 
4. Create a table exif: 

> [!NOTE]
> Database model will be added soon

## Other APIs used 

### CarbonTracer

1. Create yourself a CarbonTracer account on https://carbontracer.uni-graz.at/signup
2. An API Key will be provided to you. Use this API Key for the environment variable `CARBONTRACER_KEY`

### SightEngine

1. Create yourself a SightEngine account on https://sightengine.com/
2. Use your user and the provided secret for the environment variables `SIGHTENGINE_USER` and `SIGHTENGINE_SECRET`

## Installation

> [!CAUTION] 
> Information missing