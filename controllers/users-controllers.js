// this controller will have all middleware functions required by the users

const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");

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

let users = [];
const getAllUsers = (req, res, next) => {
  DUMMY_USERS.forEach((user) => {
    users.push(user.name);
  });

  res.status(200).json({ users: users });
};

const signup = (req, res, next) => {
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find(user => user.email === email);

  if(hasUser){
      throw new HttpError('Could not create user, email already exists', 422);
  }
  
  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };
  DUMMY_USERS.push(createdUser);
  res.status(201).json({ message: "User has been created", user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find((user) => user.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("Invalid Credentials, Not identified", 401);
  }
  res.json({ message: "logged in successfully" });
};

//export controllers functions

exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;
