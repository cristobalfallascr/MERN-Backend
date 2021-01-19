// this controller will have all middleware functions required by the places-routes.js
//no need to require express as this is not being used here

const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");

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

const getPlacebyId = async (req, res, next) => {
  //to access dynamic path, use ":" and specify parameter name, then use req.params.pId to get access
  const placeId = req.params.pId;
  let place;
  try {
    place = await Place.findById(placeId); //this does not return promise
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place",
      500
    );

    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "could not find a place for the provided place ID",
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
  // if the name of the property is equal to name of variable, then you can use just the property "place"
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uId;
  let places;
  try {
    //find in mongoose returns an array
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = HttpError("     Something went wrong, try again later", 500);
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("could not find a place for the provided user ID", 404)
    );
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid Inputs", 422));
  }
  //using object desctructuring to get req.body data
  const { title, description, address, creator } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: "gets",
    creator,
  });
  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }

  res.status(201).json({ message: "New Place added: ", place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Something went wrong, could not find a place",
      500
    );
    return next(error);
  }
  const { title, description } = req.body;
  const placeId = req.params.pId;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place",
      500
    );
    return next(error);
  }

  if (!place.id) {
    const error = new HttpError("Place not found, it cannot be updated", 404);
    return next(error);
  }
  //update the title and description for the place
  place.title = title;
  place.description = description;
  // update the array with the new place, the object being updated is the one in the identified index

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place",
      500
    );
    return next(error);
  }
  //send response status
  res.status(200).json({
    message: "Updated successfully",
    place: place.toObject({ getters: true }),
  });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pId;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      " something went wrong, no place was found",
      500
    );
    return next(error);
  }

  try {
    await place.remove();
  } catch (err) {
    const error = new HttpError(" unable to remove place", 500);
    return next(error);
  }

  res.status(200).json({ message: "Place has been deleted" });
};

//module.exports allow to export single component

// this need to be export sparate:
exports.getPlacebyId = getPlacebyId;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
