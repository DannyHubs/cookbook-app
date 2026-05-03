"use strict";

const recipeDao = require("../../dao/recipe-dao");
const { validate } = require("../../validation-types/validator");
const { listRecipeDtoInType } = require("../../validation-types/recipe-types");

const ERROR_PREFIX = "cookbook/recipe/list/";

async function listAbl(req, res) {
  const dtoOut = { warningList: [] };

  try {
    const dtoIn = { ...req.query, ...req.body };

    if (dtoIn.pageInfo && typeof dtoIn.pageInfo === "string") {
      try { dtoIn.pageInfo = JSON.parse(dtoIn.pageInfo); } catch (e) { /* ignore */ }
    }

    const validationResult = validate(dtoIn, listRecipeDtoInType);
    if (!validationResult.valid) {
      return res.status(400).json({
        code: `${ERROR_PREFIX}invalidDtoIn`,
        message: "DtoIn is not valid.",
        params: {
          invalidTypeKeyMap: validationResult.invalidTypeKeyMap,
          invalidValueKeyMap: validationResult.invalidValueKeyMap,
          missingKeyMap: validationResult.missingKeyMap
        }
      });
    }

    if (validationResult.unsupportedKeyList.length > 0) {
      dtoOut.warningList.push({
        code: `${ERROR_PREFIX}unsupportedKeys`,
        message: "DtoIn contains unsupported keys.",
        params: { unsupportedKeyList: validationResult.unsupportedKeyList }
      });
    }

    const result = recipeDao.list(dtoIn);
    Object.assign(dtoOut, result);
    return res.status(200).json(dtoOut);
  } catch (err) {
    return res.status(500).json({
      code: `${ERROR_PREFIX}unexpectedError`,
      message: err.message
    });
  }
}

module.exports = listAbl;
