const express = require("express");

const users = require("./users");
const projects = require("./projects");

const router = express.Router();

router.use("/users", users.router);
router.use("/projects", projects.router);

module.exports = {router};