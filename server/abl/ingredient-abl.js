const ingredientDao = require("../dao/ingredient-dao");
const recipeDao = require("../dao/recipe-dao");
const recipeAbl = require("./recipe-abl");
const AppError = require("../app-error");
const { validateDtoIn } = require("../validator");
const types = require("../validation-types/ingredient-types");

const ERROR_PREFIX = "cookbook-main";

const ingredientAbl = {
  create(rawDtoIn) {
    const { dtoIn, warnings } = validateDtoIn(
      rawDtoIn,
      types.ingredientCreateDtoInType,
      `${ERROR_PREFIX}/ingredientCreate`
    );

    const recipe = recipeDao.get(dtoIn.recipeId);
    if (!recipe) {
      throw new AppError(
        `${ERROR_PREFIX}/ingredientCreate/recipeNotFound`,
        "Parent recipe does not exist.",
        { recipeId: dtoIn.recipeId }
      );
    }

    let ingredient;
    try {
      ingredient = ingredientDao.create(dtoIn);
    } catch (e) {
      throw new AppError(
        `${ERROR_PREFIX}/ingredientCreate/ingredientDaoCreateFailed`,
        "Ingredient could not be saved.",
        { cause: { message: e.message } }
      );
    }

    recipeAbl.recomputeTotalCalories(dtoIn.recipeId);

    return { ...ingredient, uuAppErrorMap: warnings };
  },

  get(rawDtoIn) {
    const { dtoIn, warnings } = validateDtoIn(
      rawDtoIn,
      types.ingredientGetDtoInType,
      `${ERROR_PREFIX}/ingredientGet`
    );

    const ingredient = ingredientDao.get(dtoIn.id);
    if (!ingredient) {
      throw new AppError(
        `${ERROR_PREFIX}/ingredientGet/ingredientNotFound`,
        "Ingredient with given id was not found.",
        { ingredientId: dtoIn.id }
      );
    }
    return { ...ingredient, uuAppErrorMap: warnings };
  },

  update(rawDtoIn) {
    const { dtoIn, warnings } = validateDtoIn(
      rawDtoIn,
      types.ingredientUpdateDtoInType,
      `${ERROR_PREFIX}/ingredientUpdate`
    );

    const existing = ingredientDao.get(dtoIn.id);
    if (!existing) {
      throw new AppError(
        `${ERROR_PREFIX}/ingredientUpdate/ingredientNotFound`,
        "Ingredient with given id was not found.",
        { ingredientId: dtoIn.id }
      );
    }

    const updated = ingredientDao.update(dtoIn);
    recipeAbl.recomputeTotalCalories(existing.recipeId);

    return { ...updated, uuAppErrorMap: warnings };
  },

  delete_(rawDtoIn) {
    const { dtoIn, warnings } = validateDtoIn(
      rawDtoIn,
      types.ingredientDeleteDtoInType,
      `${ERROR_PREFIX}/ingredientDelete`
    );

    const existing = ingredientDao.get(dtoIn.id);
    if (existing) {
      ingredientDao.delete(dtoIn.id);
      recipeAbl.recomputeTotalCalories(existing.recipeId);
    }

    return { uuAppErrorMap: warnings };
  },

  listByRecipe(rawDtoIn) {
    const { dtoIn, warnings } = validateDtoIn(
      rawDtoIn,
      types.ingredientListByRecipeDtoInType,
      `${ERROR_PREFIX}/ingredientListByRecipe`
    );

    const result = ingredientDao.listByRecipe(dtoIn.recipeId);
    return { ...result, uuAppErrorMap: warnings };
  }
};

module.exports = ingredientAbl;
