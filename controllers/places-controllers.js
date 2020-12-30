// this controller will have all middleware functions required by the places-routes.js
//no need to require express as this is not being used here

const { v4: uuidv4 } = require('uuid');
const HttpError = require("../models/http-error");

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of th most famous skyscrapers in the world",
    location: {
      lat: 40.7484405,
      lng: -73.9856644,
    },
    address: "20 W 34th St, New York, NY 10001, United States",
    creator: "u1",
  },
];

const getPlacebyId = (req, res, next) => {
  //to access dynamic path, use ":" and specify parameter name, then use req.params.pId to get access
  const placeId = req.params.pId;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    throw new HttpError(
      "could not find a place for the provided place ID",
      404
    );
  }

  res.json({ place: place });
  // if the name of the property is equal to name of variable, then you can use just the property "place"
};

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uId;
  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });

  if (!place) {
    return next(
      new HttpError("could not find a place for the provided user ID", 404)
    );
  }
  res.json({
    place,
  });
};

const createPlace = (req, res, next) => {
  //using object desctructuring to get req.body data
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id:uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace); //or can use unshift(createdPlace) if you want to add this to the first place
  res.status(201).json({ message: "New Place added: ", place: createdPlace });
};

//module.exports allow to export single component

// this need to be export sparate:
exports.getPlacebyId = getPlacebyId;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
