const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
const {MONGO_DB_PASS} = require('./util/priv');
const app = express();

app.use(bodyParser.json());

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
  .connect("mongodb+srv://[]:"+MONGO_DB_PASS+"@cluster0.1wlk1.mongodb.net/places?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  //if connection is successful, we start the backend server
  .then(() => {
    console.log("Connection to DB is established")
    app.listen(5000, () => {
      console.log("App listening on port 5000");
    });
  })
  .catch((err)=>{
    console.log(err);
  });
