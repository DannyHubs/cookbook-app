const CATEGORIES = ["breakfast", "main-course", "dessert", "snack", "drink"];

const recipeCreateDtoInType = {
  name:         { type: "string", required: true,  maxLength: 200 },
  description:  { type: "string", required: false, maxLength: 1000, default: "" },
  instructions: { type: "string", required: false, maxLength: 5000, default: "" },
  servings:     { type: "number", required: false, min: 1, default: 1 },
  prepTimeMin:  { type: "number", required: false, min: 0, default: 0 },
  cookTimeMin:  { type: "number", required: false, min: 0, default: 0 },
  category:     { type: "string", required: false, enum: CATEGORIES, default: "main-course" }
};

const recipeGetDtoInType = {
  id: { type: "string", required: true }
};

const recipeUpdateDtoInType = {
  id:           { type: "string", required: true },
  name:         { type: "string", required: false, maxLength: 200 },
  description:  { type: "string", required: false, maxLength: 1000 },
  instructions: { type: "string", required: false, maxLength: 5000 },
  servings:     { type: "number", required: false, min: 1 },
  prepTimeMin:  { type: "number", required: false, min: 0 },
  cookTimeMin:  { type: "number", required: false, min: 0 },
  category:     { type: "string", required: false, enum: CATEGORIES },
  totalCalories:{ type: "number", required: false, min: 0 }
};

const recipeDeleteDtoInType = {
  id: { type: "string", required: true }
};

const recipeListDtoInType = {
  name:     { type: "string", required: false },
  category: { type: "string", required: false, enum: CATEGORIES }
};

module.exports = {
  recipeCreateDtoInType,
  recipeGetDtoInType,
  recipeUpdateDtoInType,
  recipeDeleteDtoInType,
  recipeListDtoInType,
  CATEGORIES
};
