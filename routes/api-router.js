const express = require("express");

const users = require("./api/users");
const projects = require("./api/projects");

const router = express.Router();

router.use("/users", users.router);
router.use("/projects", projects.router);

module.exports = {router};