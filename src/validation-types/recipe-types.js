"use strict";

const recipeIngredientItem = {
  type: "object",
  properties: {
    ingredientId: { type: "string", minLength: 1 },
    amount: { type: "number", exclusiveMinimum: 0 }
  },
  required: ["ingredientId", "amount"]
};

// Schema for recipe/create dtoIn
const createRecipeDtoInType = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1, maxLength: 200 },
    description: { type: "string", maxLength: 2000 },
    instructions: { type: "string", minLength: 1, maxLength: 10000 },
    preparationTime: { type: "integer", minimum: 0, maximum: 100000 },
    servings: { type: "integer", minimum: 1, maximum: 1000 },
    category: {
      type: "string",
      enum: ["breakfast", "lunch", "dinner", "snack", "dessert", "drink", "other"]
    },
    ingredientList: {
      type: "array",
      items: recipeIngredientItem,
      minItems: 1
    }
  },
  required: ["name", "instructions", "servings", "ingredientList"]
};

// Schema for recipe/update dtoIn
const updateRecipeDtoInType = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 1 },
    name: { type: "string", minLength: 1, maxLength: 200 },
    description: { type: "string", maxLength: 2000 },
    instructions: { type: "string", minLength: 1, maxLength: 10000 },
    preparationTime: { type: "integer", minimum: 0, maximum: 100000 },
    servings: { type: "integer", minimum: 1, maximum: 1000 },
    category: {
      type: "string",
      enum: ["breakfast", "lunch", "dinner", "snack", "dessert", "drink", "other"]
    },
    ingredientList: {
      type: "array",
      items: recipeIngredientItem,
      minItems: 1
    }
  },
  required: ["id"]
};

// Schema for recipe/get dtoIn
const getRecipeDtoInType = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 1 }
  },
  required: ["id"]
};

// Schema for recipe/delete dtoIn
const deleteRecipeDtoInType = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 1 }
  },
  required: ["id"]
};

// Schema for recipe/list dtoIn
const listRecipeDtoInType = {
  type: "object",
  properties: {
    category: {
      type: "string",
      enum: ["breakfast", "lunch", "dinner", "snack", "dessert", "drink", "other"]
    },
    pageInfo: {
      type: "object",
      properties: {
        pageIndex: { type: "integer", minimum: 0, default: 0 },
        pageSize: { type: "integer", minimum: 1, maximum: 1000, default: 100 }
      }
    }
  },
  required: []
};

module.exports = {
  createRecipeDtoInType,
  updateRecipeDtoInType,
  getRecipeDtoInType,
  deleteRecipeDtoInType,
  listRecipeDtoInType
};
