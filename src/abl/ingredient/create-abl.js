"use strict";

const ingredientDao = require("../../dao/ingredient-dao");
const { validate } = require("../../validation-types/validator");
const { createIngredientDtoInType } = require("../../validation-types/ingredient-types");

const ERROR_PREFIX = "cookbook/ingredient/create/";

async function createAbl(req, res) {
  const dtoOut = { warningList: [] };

  try {
    const dtoIn = req.body;

    // Step 1: Validate dtoIn against the type schema
    const validationResult = validate(dtoIn, createIngredientDtoInType);

    // Step 1.3: ValidationResult must not contain wrong keys
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

    // Step 1.2: Warn about unsupported keys (but proceed)
    if (validationResult.unsupportedKeyList.length > 0) {
      dtoOut.warningList.push({
        code: `${ERROR_PREFIX}unsupportedKeys`,
        message: "DtoIn contains unsupported keys.",
        params: { unsupportedKeyList: validationResult.unsupportedKeyList }
      });
      // Strip unsupported keys before persisting
      for (const key of validationResult.unsupportedKeyList) delete dtoIn[key];
    }

    // Step 2: Create ingredient in DAO
    const created = ingredientDao.create(dtoIn);

    // Step 3: Return properly filled dtoOut
    Object.assign(dtoOut, created);
    return res.status(201).json(dtoOut);
  } catch (err) {
    return res.status(500).json({
      code: `${ERROR_PREFIX}unexpectedError`,
      message: err.message
    });
  }
}

module.exports = createAbl;
