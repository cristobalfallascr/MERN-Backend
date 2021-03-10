require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const dbname = process.env.DB_NAME;
const dbUrl = `mongodb+srv://${username}:${password}@cluster0.1wlk1.mongodb.net/${dbname}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());

// this middleware will handle CORS errors to allow request from the front end going to the backend
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origing, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use("/api/places", placesRoutes); // initial path is specified as /api/places
app.use("/api/users", usersRoutes); // initial path is /api/users

//this middleware will handle error response for unsupported routes
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

//error handling middleware function, should be after the routes
//to trigger the error handling, need to call either
// throw error - for sync environments
//return next(error) - for async environments
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

// use the connect method. this will return a promise as this is async task
mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  //if connection is successful, we start the backend server
  .then(() => {
    console.log("Connection to DB is established");
    app.listen(process.env.PORT || 8081, () => {
      console.log("App listening on port 5000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
