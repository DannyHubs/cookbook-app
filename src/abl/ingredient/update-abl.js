"use strict";

const ingredientDao = require("../../dao/ingredient-dao");
const { validate } = require("../../validation-types/validator");
const { updateIngredientDtoInType } = require("../../validation-types/ingredient-types");

const ERROR_PREFIX = "cookbook/ingredient/update/";

async function updateAbl(req, res) {
  const dtoOut = { warningList: [] };

  try {
    const dtoIn = req.body;

    // Step 1: Validate
    const validationResult = validate(dtoIn, updateIngredientDtoInType);
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
      for (const key of validationResult.unsupportedKeyList) delete dtoIn[key];
    }

    // Step 2: Update ingredient
    const updated = ingredientDao.update(dtoIn);

    if (!updated) {
      return res.status(404).json({
        code: `${ERROR_PREFIX}ingredientDoesNotExist`,
        message: `Ingredient with id "${dtoIn.id}" does not exist.`,
        params: { id: dtoIn.id }
      });
    }

    // Step 3: Return dtoOut
    Object.assign(dtoOut, updated);
    return res.status(200).json(dtoOut);
  } catch (err) {
    return res.status(500).json({
      code: `${ERROR_PREFIX}unexpectedError`,
      message: err.message
    });
  }
}

module.exports = updateAbl;
