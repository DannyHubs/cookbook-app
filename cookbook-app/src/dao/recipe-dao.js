"use strict";

const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const STORAGE_FILE = path.join(__dirname, "storage", "recipes.json");

class RecipeDao {
  constructor() {
    this._ensureStorage();
  }

  _ensureStorage() {
    const dir = path.dirname(STORAGE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(STORAGE_FILE)) {
      fs.writeFileSync(STORAGE_FILE, JSON.stringify([], null, 2), "utf8");
    }
  }

  _readAll() {
    const raw = fs.readFileSync(STORAGE_FILE, "utf8");
    return JSON.parse(raw || "[]");
  }

  _writeAll(items) {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(items, null, 2), "utf8");
  }

  /**
   * Creates a recipe in storage.
   * @param {Object} recipe
   * @returns {Object} created recipe with generated id
   */
  create(recipe) {
    const items = this._readAll();
    const newItem = {
      id: uuidv4(),
      ...recipe,
      createdAt: new Date().toISOString()
    };
    items.push(newItem);
    this._writeAll(items);
    return newItem;
  }

  /**
   * Returns a recipe by id.
   * @param {string} id
   * @returns {Object|null}
   */
  get(id) {
    const items = this._readAll();
    return items.find(item => item.id === id) || null;
  }

  /**
   * Returns a list of recipes filtered by category if provided.
   * @param {Object} filter { category, pageInfo }
   * @returns {Object}
   */
  list(filter = {}) {
    let items = this._readAll();
    if (filter.category) {
      items = items.filter(item => item.category === filter.category);
    }
    const pageInfo = filter.pageInfo || { pageIndex: 0, pageSize: 100 };
    const start = pageInfo.pageIndex * pageInfo.pageSize;
    const end = start + pageInfo.pageSize;
    return {
      itemList: items.slice(start, end),
      pageInfo: {
        pageIndex: pageInfo.pageIndex,
        pageSize: pageInfo.pageSize,
        total: items.length
      }
    };
  }

  /**
   * Updates a recipe by id.
   * @param {Object} recipe with id
   * @returns {Object|null}
   */
  update(recipe) {
    const items = this._readAll();
    const idx = items.findIndex(item => item.id === recipe.id);
    if (idx === -1) return null;
    items[idx] = {
      ...items[idx],
      ...recipe,
      updatedAt: new Date().toISOString()
    };
    this._writeAll(items);
    return items[idx];
  }

  /**
   * Deletes a recipe by id.
   * @param {string} id
   * @returns {boolean}
   */
  delete(id) {
    const items = this._readAll();
    const idx = items.findIndex(item => item.id === id);
    if (idx === -1) return false;
    items.splice(idx, 1);
    this._writeAll(items);
    return true;
  }

  /**
   * Returns all recipes that contain the given ingredient id.
   * @param {string} ingredientId
   * @returns {Array}
   */
  findByIngredientId(ingredientId) {
    const items = this._readAll();
    return items.filter(recipe =>
      (recipe.ingredientList || []).some(ing => ing.ingredientId === ingredientId)
    );
  }
}

module.exports = new RecipeDao();
