const express = require("express");

const Project = require("../../models/Project");
const User = require("../../models/User");
const passportConfig = require("../../config/passport-config");

const router = express.Router();
const {ensureAuthenticated, getUsername} = passportConfig;

module.exports = {router};