"use strict";

const recipeDao = require("../../dao/recipe-dao");
const { validate } = require("../../validation-types/validator");
const { deleteRecipeDtoInType } = require("../../validation-types/recipe-types");

const ERROR_PREFIX = "cookbook/recipe/delete/";

async function deleteAbl(req, res) {
  const dtoOut = { warningList: [] };

  try {
    const dtoIn = req.body;

    const validationResult = validate(dtoIn, deleteRecipeDtoInType);
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

    const deleted = recipeDao.delete(dtoIn.id);
    if (!deleted) {
      return res.status(404).json({
        code: `${ERROR_PREFIX}recipeDoesNotExist`,
        message: `Recipe with id "${dtoIn.id}" does not exist.`,
        params: { id: dtoIn.id }
      });
    }

    dtoOut.id = dtoIn.id;
    dtoOut.deleted = true;
    return res.status(200).json(dtoOut);
  } catch (err) {
    return res.status(500).json({
      code: `${ERROR_PREFIX}unexpectedError`,
      message: err.message
    });
  }
}

module.exports = deleteAbl;
