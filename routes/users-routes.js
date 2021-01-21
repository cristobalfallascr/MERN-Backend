const express = require("express");
const {check} = require("express-validator");

const HttpError = require("../models/http-error");

const usersControllers = require("../controllers/users-controllers");

//notice that router below is will be completed with specified in app.js
const router = express.Router();

// path to get to all users in application
router.get("/", usersControllers.getUsers);

//path to /signup to the application
//using express-validator for post

router.post("/signup",[
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min:6})

],usersControllers.signup);

//path to /login
//although not needed, the login itself will validate invalid info

router.post("/login",
// [
//     check('email').isEmail(),
//     check('password').not().isEmpty(),
// ]
 usersControllers.login);

//exports
module.exports = router;
