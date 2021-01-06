// this controller will have all middleware functions required by the places-routes.js
//no need to require express as this is not being used here

const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");

let DUMMY_PLACES = [
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

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uId;
  //filter will return any places with same user ID while. .find() only returns one place
  const places = DUMMY_PLACES.filter((p) => {
    return p.creator === userId;
  });

  if (!places || places.length === 0) {
    return next(
      new HttpError("could not find a place for the provided user ID", 404)
    );
  }
  res.json({
    places,
  });
};

const createPlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid Inputs", 422);
  }
  //using object desctructuring to get req.body data
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace); //or can use unshift(createdPlace) if you want to add this to the first place
  res.status(201).json({ message: "New Place added: ", place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs, cannot update", 421);
  }
  const { title, description } = req.body;
  const placeId = req.params.pId;
  const updatedPlace = {
    ...DUMMY_PLACES.find((place) => place.id === placeId),
  }; // spread operator to create a copy of the original place
  console.log(updatedPlace.id);
  const placeIndex = DUMMY_PLACES.findIndex((place) => place.id === placeId); //find index of the place

  if (!updatedPlace.id) {
    throw new HttpError("Cannot update the place as it doest not exist", 404);
  }
  //update the title and description for the place
  updatedPlace.title = title;
  updatedPlace.description = description;
  // update the array with the new place, the object being updated is the one in the identified index
  DUMMY_PLACES[placeIndex] = updatedPlace;
  //send response status
  res
    .status(200)
    .json({ message: "Updated successfully", place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pId;
  DUMMY_PLACES = DUMMY_PLACES.filter((place) => place.id !== placeId); // filter array and return a new array where the identified place is ignored
  res.status(200).json({ message: "Place has been deleted" });
};

//module.exports allow to export single component

// this need to be export sparate:
exports.getPlacebyId = getPlacebyId;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
