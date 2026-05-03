const { v4: uuidv4 } = require("uuid");
const storage = require("./storage/file-storage");

const COLLECTION = "ingredients";

const ingredientDao = {
  create(data) {
    const ingredients = storage.readAll(COLLECTION);
    const now = new Date().toISOString();
    const ingredient = {
      id: uuidv4(),
      ...data,
      createdAt: now,
      updatedAt: now
    };
    ingredients.push(ingredient);
    storage.writeAll(COLLECTION, ingredients);
    return ingredient;
  },

  get(id) {
    const ingredients = storage.readAll(COLLECTION);
    return ingredients.find((i) => i.id === id) || null;
  },

  update(data) {
    const ingredients = storage.readAll(COLLECTION);
    const idx = ingredients.findIndex((i) => i.id === data.id);
    if (idx === -1) return null;
    ingredients[idx] = { ...ingredients[idx], ...data, updatedAt: new Date().toISOString() };
    storage.writeAll(COLLECTION, ingredients);
    return ingredients[idx];
  },

  delete(id) {
    const ingredients = storage.readAll(COLLECTION);
    const filtered = ingredients.filter((i) => i.id !== id);
    storage.writeAll(COLLECTION, filtered);
    return {};
  },

  listByRecipe(recipeId) {
    const ingredients = storage.readAll(COLLECTION);
    const filtered = ingredients.filter((i) => i.recipeId === recipeId);
    return { itemList: filtered, pageInfo: { total: filtered.length } };
  }
};

module.exports = ingredientDao;
