const { v4: uuidv4 } = require("uuid");
const storage = require("./storage/file-storage");

const COLLECTION = "recipes";

const recipeDao = {
  create(data) {
    const recipes = storage.readAll(COLLECTION);
    const now = new Date().toISOString();
    const recipe = {
      id: uuidv4(),
      ...data,
      totalCalories: data.totalCalories ?? 0,
      createdAt: now,
      updatedAt: now
    };
    recipes.push(recipe);
    storage.writeAll(COLLECTION, recipes);
    return recipe;
  },

  get(id) {
    const recipes = storage.readAll(COLLECTION);
    return recipes.find((r) => r.id === id) || null;
  },

  update(data) {
    const recipes = storage.readAll(COLLECTION);
    const idx = recipes.findIndex((r) => r.id === data.id);
    if (idx === -1) return null;
    recipes[idx] = { ...recipes[idx], ...data, updatedAt: new Date().toISOString() };
    storage.writeAll(COLLECTION, recipes);
    return recipes[idx];
  },

  delete(id) {
    const recipes = storage.readAll(COLLECTION);
    const filtered = recipes.filter((r) => r.id !== id);
    storage.writeAll(COLLECTION, filtered);
    return {};
  },

  list(filter = {}) {
    let recipes = storage.readAll(COLLECTION);
    if (filter.name) {
      const q = filter.name.toLowerCase();
      recipes = recipes.filter((r) => r.name.toLowerCase().includes(q));
    }
    if (filter.category) {
      recipes = recipes.filter((r) => r.category === filter.category);
    }
    return { itemList: recipes, pageInfo: { total: recipes.length } };
  }
};

module.exports = recipeDao;
