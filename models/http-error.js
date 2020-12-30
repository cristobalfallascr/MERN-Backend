const express = require("express");

class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); //add message property to the instances
    this.code = errorCode; //adds a code property
  }
}

module.exports = HttpError;
