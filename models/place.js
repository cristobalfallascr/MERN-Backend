const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  address: { type: String, required: true },
  creator: { type: String, required: true },
});

//.model takes two parameters, the name of the model and the schema of the model
module.exports = mongoose.model("Place", placeSchema);
