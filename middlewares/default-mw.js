const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

module.exports = [
    logger("dev"),
    express.json(),
    express.urlencoded({
        extended: false
    }),
    cookieParser()
];