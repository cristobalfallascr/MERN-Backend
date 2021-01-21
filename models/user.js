const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//set schema for the user
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  // to establish relationship between two documents, use the below
  // add [ ] to tell mongoose that places can take multiple related documents in an array
  places: [{ type: mongoose.Types.ObjectId, ref: "Place", required: true }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
