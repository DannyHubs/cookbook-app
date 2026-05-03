"use strict";

const express = require("express");
const router = express.Router();

const createAbl = require("../abl/recipe/create-abl");
const getAbl = require("../abl/recipe/get-abl");
const listAbl = require("../abl/recipe/list-abl");
const updateAbl = require("../abl/recipe/update-abl");
const deleteAbl = require("../abl/recipe/delete-abl");

router.post("/create", createAbl);
router.get("/get", getAbl);
router.post("/get", getAbl);
router.get("/list", listAbl);
router.post("/list", listAbl);
router.post("/update", updateAbl);
router.post("/delete", deleteAbl);

module.exports = router;
