// this controller will have all middleware functions required by the users

const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/user");

const DUMMY_USERS = [
  {
    id: "u1",
    name: " Cris Fallas",
    email: "cris@cris.com",
    password: "testers",
  },
  {
    id: "u2",
    name: " Vale Fallas",
    email: "Vale@vale.com",
    password: "testers",
  },
];

const getUsers = async (req, res, next) => {
  //using projections to get only the data required
  let users;
  try {
    users = await User.find({}, " -password");
  } catch (err) {
    const error = new HttpError("Fetching users failed, please try later", 500);
  }

  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid inputs provided ", 400);
    return next(error);
  }
  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signing up failed, try again later", 500);
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError(" User exists, please login instead", 422);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: "only for demo purposes",
    password,
    //define the below as an empty array
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("error.", 500);
    return next(error);
  }
  res.status(201).json({
    user: createdUser.toObject({ getters: true }),
    message: " User created",
  });
};

const login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid credentials provided ", 401));
  }
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Login, try again later", 500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(" invalid credentials", 401);
    return next(error);
  }

  res.json({ message: "logged in successfully" });
};

//export controllers functions

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
