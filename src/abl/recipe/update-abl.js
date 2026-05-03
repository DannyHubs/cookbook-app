"use strict";

const recipeDao = require("../../dao/recipe-dao");
const ingredientDao = require("../../dao/ingredient-dao");
const { validate } = require("../../validation-types/validator");
const { updateRecipeDtoInType } = require("../../validation-types/recipe-types");

const ERROR_PREFIX = "cookbook/recipe/update/";

function calculateNutrition(ingredientList, ingredientLookup) {
  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  for (const item of ingredientList) {
    const ing = ingredientLookup[item.ingredientId];
    if (!ing) continue;
    const factor = item.amount / 100;
    totals.calories += (ing.caloriesPer100 || 0) * factor;
    totals.protein += (ing.proteinPer100 || 0) * factor;
    totals.carbs += (ing.carbsPer100 || 0) * factor;
    totals.fat += (ing.fatPer100 || 0) * factor;
  }
  for (const key of Object.keys(totals)) {
    totals[key] = Math.round(totals[key] * 100) / 100;
  }
  return totals;
}

async function updateAbl(req, res) {
  const dtoOut = { warningList: [] };

  try {
    const dtoIn = req.body;

    const validationResult = validate(dtoIn, updateRecipeDtoInType);
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

    // If ingredient list is being updated, validate references and recompute nutrition
    if (dtoIn.ingredientList) {
      const missingIds = [];
      const ingredientLookup = {};
      for (const item of dtoIn.ingredientList) {
        const ing = ingredientDao.get(item.ingredientId);
        if (!ing) missingIds.push(item.ingredientId);
        else ingredientLookup[item.ingredientId] = ing;
      }
      if (missingIds.length > 0) {
        return res.status(400).json({
          code: `${ERROR_PREFIX}ingredientDoesNotExist`,
          message: "One or more referenced ingredients do not exist.",
          params: { missingIngredientIdList: missingIds }
        });
      }
      dtoIn.nutrition = calculateNutrition(dtoIn.ingredientList, ingredientLookup);
    }

    const updated = recipeDao.update(dtoIn);
    if (!updated) {
      return res.status(404).json({
        code: `${ERROR_PREFIX}recipeDoesNotExist`,
        message: `Recipe with id "${dtoIn.id}" does not exist.`,
        params: { id: dtoIn.id }
      });
    }

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
