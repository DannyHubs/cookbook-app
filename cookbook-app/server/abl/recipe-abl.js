const recipeDao = require("../dao/recipe-dao");
const ingredientDao = require("../dao/ingredient-dao");
const AppError = require("../app-error");
const { validateDtoIn } = require("../validator");
const types = require("../validation-types/recipe-types");

const ERROR_PREFIX = "cookbook-main";

function recomputeTotalCalories(recipeId) {
  const list = ingredientDao.listByRecipe(recipeId).itemList;
  const total = list.reduce((sum, ing) => sum + (ing.calories || 0), 0);
  recipeDao.update({ id: recipeId, totalCalories: total });
  return total;
}

const recipeAbl = {
  create(rawDtoIn) {
    const { dtoIn, warnings } = validateDtoIn(
      rawDtoIn,
      types.recipeCreateDtoInType,
      `${ERROR_PREFIX}/recipeCreate`
    );

    let recipe;
    try {
      recipe = recipeDao.create(dtoIn);
    } catch (e) {
      throw new AppError(
        `${ERROR_PREFIX}/recipeCreate/recipeDaoCreateFailed`,
        "Recipe could not be saved to the database.",
        { cause: { message: e.message } }
      );
    }

    return { ...recipe, uuAppErrorMap: warnings };
  },

  get(rawDtoIn) {
    const { dtoIn, warnings } = validateDtoIn(
      rawDtoIn,
      types.recipeGetDtoInType,
      `${ERROR_PREFIX}/recipeGet`
    );

    const recipe = recipeDao.get(dtoIn.id);
    if (!recipe) {
      throw new AppError(
        `${ERROR_PREFIX}/recipeGet/recipeNotFound`,
        "Recipe with given id was not found.",
        { recipeId: dtoIn.id }
      );
    }

    const ingredientList = ingredientDao.listByRecipe(dtoIn.id).itemList;
    return { ...recipe, ingredientList, uuAppErrorMap: warnings };
  },

  update(rawDtoIn) {
    const { dtoIn, warnings } = validateDtoIn(
      rawDtoIn,
      types.recipeUpdateDtoInType,
      `${ERROR_PREFIX}/recipeUpdate`
    );

    const existing = recipeDao.get(dtoIn.id);
    if (!existing) {
      throw new AppError(
        `${ERROR_PREFIX}/recipeUpdate/recipeNotFound`,
        "Recipe with given id was not found.",
        { recipeId: dtoIn.id }
      );
    }

    let updated;
    try {
      updated = recipeDao.update(dtoIn);
    } catch (e) {
      throw new AppError(
        `${ERROR_PREFIX}/recipeUpdate/recipeDaoUpdateFailed`,
        "Recipe could not be updated.",
        { cause: { message: e.message } }
      );
    }

    return { ...updated, uuAppErrorMap: warnings };
  },

  // delete is a reserved word in some contexts -> exposed as delete_
  delete_(rawDtoIn) {
    const { dtoIn, warnings } = validateDtoIn(
      rawDtoIn,
      types.recipeDeleteDtoInType,
      `${ERROR_PREFIX}/recipeDelete`
    );

    // cascade: delete ingredients first
    const ingredients = ingredientDao.listByRecipe(dtoIn.id).itemList;
    for (const ing of ingredients) {
      ingredientDao.delete(ing.id);
    }
    recipeDao.delete(dtoIn.id);

    return { uuAppErrorMap: warnings };
  },

  list(rawDtoIn) {
    const { dtoIn, warnings } = validateDtoIn(
      rawDtoIn,
      types.recipeListDtoInType,
      `${ERROR_PREFIX}/recipeList`
    );

    const result = recipeDao.list(dtoIn);
    return { ...result, uuAppErrorMap: warnings };
  },

  recomputeTotalCalories
};

module.exports = recipeAbl;
