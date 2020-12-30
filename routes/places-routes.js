const express = require("express");

const HttpError = require("../models/http-error");

const router = express.Router();

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

//notice that router below is will be completed with specified in app.js, so path is "/api/places/"
router.get("/:pId", (req, res, next) => {
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
});

// route to /api/places/users/:uid

router.get("/user/:uId", (req, res, next) => {
  const userId = req.params.uId;
  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });

  if (!place) {
    return next(new HttpError("could not find a place for the provided user ID", 404));
  }
  res.json({
    place,
  });
});

module.exports = router;
