"use strict";

const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const STORAGE_FILE = path.join(__dirname, "storage", "ingredients.json");

class IngredientDao {
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
   * Creates an ingredient in storage.
   * @param {Object} ingredient
   * @returns {Object} created ingredient with generated id
   */
  create(ingredient) {
    const items = this._readAll();
    const newItem = {
      id: uuidv4(),
      ...ingredient,
      createdAt: new Date().toISOString()
    };
    items.push(newItem);
    this._writeAll(items);
    return newItem;
  }

  /**
   * Returns an ingredient by id.
   * @param {string} id
   * @returns {Object|null}
   */
  get(id) {
    const items = this._readAll();
    return items.find(item => item.id === id) || null;
  }

  /**
   * Returns a list of ingredients optionally filtered.
   * @param {Object} filter
   * @returns {Array}
   */
  list(filter = {}) {
    const items = this._readAll();
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
   * Updates an ingredient by id.
   * @param {Object} ingredient with id
   * @returns {Object|null}
   */
  update(ingredient) {
    const items = this._readAll();
    const idx = items.findIndex(item => item.id === ingredient.id);
    if (idx === -1) return null;
    items[idx] = {
      ...items[idx],
      ...ingredient,
      updatedAt: new Date().toISOString()
    };
    this._writeAll(items);
    return items[idx];
  }

  /**
   * Deletes an ingredient by id.
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
}

module.exports = new IngredientDao();
