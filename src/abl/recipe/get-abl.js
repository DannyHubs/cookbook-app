"use strict";

const recipeDao = require("../../dao/recipe-dao");
const ingredientDao = require("../../dao/ingredient-dao");
const { validate } = require("../../validation-types/validator");
const { getRecipeDtoInType } = require("../../validation-types/recipe-types");

const ERROR_PREFIX = "cookbook/recipe/get/";

async function getAbl(req, res) {
  const dtoOut = { warningList: [] };

  try {
    const dtoIn = { ...req.query, ...req.body };

    // Step 1: Validate
    const validationResult = validate(dtoIn, getRecipeDtoInType);
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

    // Step 2: Fetch recipe
    const recipe = recipeDao.get(dtoIn.id);
    if (!recipe) {
      return res.status(404).json({
        code: `${ERROR_PREFIX}recipeDoesNotExist`,
        message: `Recipe with id "${dtoIn.id}" does not exist.`,
        params: { id: dtoIn.id }
      });
    }

    // Step 3: Enrich with ingredient detail
    const enrichedIngredients = (recipe.ingredientList || []).map(item => {
      const ingredient = ingredientDao.get(item.ingredientId);
      return {
        ...item,
        ingredient: ingredient || null
      };
    });

    // Step 4: Return dtoOut
    Object.assign(dtoOut, recipe, { ingredientList: enrichedIngredients });
    return res.status(200).json(dtoOut);
  } catch (err) {
    return res.status(500).json({
      code: `${ERROR_PREFIX}unexpectedError`,
      message: err.message
    });
  }
}

module.exports = getAbl;
