const express = require("express");

const HttpError = require("../models/http-error");

const usersControllers = require("../controllers/users-controllers");

//notice that router below is will be completed with specified in app.js
const router = express.Router();

// path to get to all users in application
router.get("/", usersControllers.getAllUsers);

//path to /signup to the application

router.post("/signup", usersControllers.signup);

//path to /login

router.post("/login", usersControllers.login);

//exports
module.exports = router;
