"use strict";

const express = require("express");
const router = express.Router();

const createAbl = require("../abl/ingredient/create-abl");
const getAbl = require("../abl/ingredient/get-abl");
const listAbl = require("../abl/ingredient/list-abl");
const updateAbl = require("../abl/ingredient/update-abl");
const deleteAbl = require("../abl/ingredient/delete-abl");

router.post("/create", createAbl);
router.get("/get", getAbl);
router.post("/get", getAbl);
router.get("/list", listAbl);
router.post("/list", listAbl);
router.post("/update", updateAbl);
router.post("/delete", deleteAbl);

module.exports = router;
