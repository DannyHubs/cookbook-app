const UNITS = ["g", "kg", "ml", "l", "pcs", "tbsp", "tsp", "cup"];

const ingredientCreateDtoInType = {
  recipeId: { type: "string", required: true },
  name:     { type: "string", required: true, maxLength: 200 },
  amount:   { type: "number", required: true, min: 0 },
  unit:     { type: "string", required: false, enum: UNITS, default: "g" },
  calories: { type: "number", required: false, min: 0, default: 0 },
  protein:  { type: "number", required: false, min: 0, default: 0 },
  carbs:    { type: "number", required: false, min: 0, default: 0 },
  fat:      { type: "number", required: false, min: 0, default: 0 }
};

const ingredientGetDtoInType = {
  id: { type: "string", required: true }
};

const ingredientUpdateDtoInType = {
  id:       { type: "string", required: true },
  name:     { type: "string", required: false, maxLength: 200 },
  amount:   { type: "number", required: false, min: 0 },
  unit:     { type: "string", required: false, enum: UNITS },
  calories: { type: "number", required: false, min: 0 },
  protein:  { type: "number", required: false, min: 0 },
  carbs:    { type: "number", required: false, min: 0 },
  fat:      { type: "number", required: false, min: 0 }
};

const ingredientDeleteDtoInType = {
  id: { type: "string", required: true }
};

const ingredientListByRecipeDtoInType = {
  recipeId: { type: "string", required: true }
};

module.exports = {
  ingredientCreateDtoInType,
  ingredientGetDtoInType,
  ingredientUpdateDtoInType,
  ingredientDeleteDtoInType,
  ingredientListByRecipeDtoInType,
  UNITS
};
