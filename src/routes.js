const express = require("express");

const routes = express.Router();

const SessionController = require("../src/app/controllers/SessionController");

routes.post("/sessions", SessionController.store);

module.exports = routes;
