const express = require("express");
const {check} = require("express-validator");

const HttpError = require("../models/http-error");

const usersControllers = require("../controllers/users-controllers");

//notice that router below is will be completed with specified in app.js
const router = express.Router();

// path to get to all users in application
router.get("/", usersControllers.getAllUsers);

//path to /signup to the application
//using express-validator for post

router.post("/signup",[
    check('name').not().isEmpty(),
    check('email').isEmail(),
    check('password').isLength({min:4})

],usersControllers.signup);

//path to /login

router.post("/login",[
    check('email').isEmail(),
    check('password').not().isEmpty(),
], usersControllers.login);

//exports
module.exports = router;
