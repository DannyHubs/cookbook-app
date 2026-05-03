"use strict";

const ingredientDao = require("../../dao/ingredient-dao");
const recipeDao = require("../../dao/recipe-dao");
const { validate } = require("../../validation-types/validator");
const { deleteIngredientDtoInType } = require("../../validation-types/ingredient-types");

const ERROR_PREFIX = "cookbook/ingredient/delete/";

async function deleteAbl(req, res) {
  const dtoOut = { warningList: [] };

  try {
    const dtoIn = req.body;

    // Step 1: Validate
    const validationResult = validate(dtoIn, deleteIngredientDtoInType);
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

    // Step 2: Check relationship - ingredient cannot be deleted if used in recipes
    const linkedRecipes = recipeDao.findByIngredientId(dtoIn.id);
    if (linkedRecipes.length > 0) {
      return res.status(400).json({
        code: `${ERROR_PREFIX}ingredientIsUsedInRecipes`,
        message: "Ingredient cannot be deleted because it is used in one or more recipes.",
        params: {
          recipeIdList: linkedRecipes.map(r => r.id)
        }
      });
    }

    // Step 3: Delete from DAO
    const deleted = ingredientDao.delete(dtoIn.id);

    if (!deleted) {
      return res.status(404).json({
        code: `${ERROR_PREFIX}ingredientDoesNotExist`,
        message: `Ingredient with id "${dtoIn.id}" does not exist.`,
        params: { id: dtoIn.id }
      });
    }

    // Step 4: Return dtoOut
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
