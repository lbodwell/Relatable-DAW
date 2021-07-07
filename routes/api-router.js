const express = require("express");

const users = require("./api/users");
const projects = require("./api/projects");
const auth = require("./auth");

const router = express.Router();

router.use("/users", users.router);
router.use("/projects", projects.router);
router.use("/auth", auth.router);

module.exports = {router};