const express = require("express");

const routes = express.Router();

const SessionController = require("../src/app/controllers/SessionController");
const DashboardController = require("../src/app/controllers/DashboardController");

routes.post("/sessions", SessionController.store);
routes.get("/dashboard", DashboardController.index);

module.exports = routes;
