"use strict";

// Schema for ingredient/create dtoIn
const createIngredientDtoInType = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1, maxLength: 100 },
    unit: {
      type: "string",
      enum: ["g", "kg", "ml", "l", "tsp", "tbsp", "cup", "oz", "lb", "piece"]
    },
    caloriesPer100: { type: "number", minimum: 0, maximum: 10000 },
    proteinPer100: { type: "number", minimum: 0, maximum: 1000 },
    carbsPer100: { type: "number", minimum: 0, maximum: 1000 },
    fatPer100: { type: "number", minimum: 0, maximum: 1000 }
  },
  required: ["name", "unit", "caloriesPer100"]
};

// Schema for ingredient/update dtoIn
const updateIngredientDtoInType = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 1 },
    name: { type: "string", minLength: 1, maxLength: 100 },
    unit: {
      type: "string",
      enum: ["g", "kg", "ml", "l", "tsp", "tbsp", "cup", "oz", "lb", "piece"]
    },
    caloriesPer100: { type: "number", minimum: 0, maximum: 10000 },
    proteinPer100: { type: "number", minimum: 0, maximum: 1000 },
    carbsPer100: { type: "number", minimum: 0, maximum: 1000 },
    fatPer100: { type: "number", minimum: 0, maximum: 1000 }
  },
  required: ["id"]
};

// Schema for ingredient/get dtoIn
const getIngredientDtoInType = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 1 }
  },
  required: ["id"]
};

// Schema for ingredient/delete dtoIn
const deleteIngredientDtoInType = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 1 }
  },
  required: ["id"]
};

// Schema for ingredient/list dtoIn
const listIngredientDtoInType = {
  type: "object",
  properties: {
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
  createIngredientDtoInType,
  updateIngredientDtoInType,
  getIngredientDtoInType,
  deleteIngredientDtoInType,
  listIngredientDtoInType
};
