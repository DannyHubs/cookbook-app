"use strict";

const ingredientDao = require("../../dao/ingredient-dao");
const { validate } = require("../../validation-types/validator");
const { listIngredientDtoInType } = require("../../validation-types/ingredient-types");

const ERROR_PREFIX = "cookbook/ingredient/list/";

async function listAbl(req, res) {
  const dtoOut = { warningList: [] };

  try {
    const dtoIn = { ...req.query, ...req.body };

    // Coerce paging numbers from query string
    if (dtoIn.pageInfo && typeof dtoIn.pageInfo === "string") {
      try { dtoIn.pageInfo = JSON.parse(dtoIn.pageInfo); } catch (e) { /* ignore */ }
    }

    // Step 1: Validate
    const validationResult = validate(dtoIn, listIngredientDtoInType);
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

    // Step 2: List ingredients
    const result = ingredientDao.list(dtoIn);

    // Step 3: Return dtoOut
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
