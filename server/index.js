const express = require("express");
const path = require("path");
const recipeAbl = require("./abl/recipe-abl");
const ingredientAbl = require("./abl/ingredient-abl");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// helper to wrap async handlers and forward errors
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// ---------- Recipe routes ----------
app.post("/recipe/create", wrap((req, res) => res.json(recipeAbl.create(req.body))));
app.get("/recipe/get", wrap((req, res) => res.json(recipeAbl.get(req.query))));
app.post("/recipe/update", wrap((req, res) => res.json(recipeAbl.update(req.body))));
app.post("/recipe/delete", wrap((req, res) => res.json(recipeAbl.delete_(req.body))));
app.get("/recipe/list", wrap((req, res) => res.json(recipeAbl.list(req.query))));

// ---------- Ingredient routes ----------
app.post("/ingredient/create", wrap((req, res) => res.json(ingredientAbl.create(req.body))));
app.get("/ingredient/get", wrap((req, res) => res.json(ingredientAbl.get(req.query))));
app.post("/ingredient/update", wrap((req, res) => res.json(ingredientAbl.update(req.body))));
app.post("/ingredient/delete", wrap((req, res) => res.json(ingredientAbl.delete_(req.body))));
app.get("/ingredient/listByRecipe", wrap((req, res) => res.json(ingredientAbl.listByRecipe(req.query))));

// ---------- Error handler ----------
app.use((err, req, res, next) => {
  console.error(err);
  if (err.code) {
    // Application/business error
    res.status(400).json({
      code: err.code,
      message: err.message,
      params: err.params || {}
    });
  } else {
    res.status(500).json({
      code: "internalServerError",
      message: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Cookbook app running on http://localhost:${PORT}`);
});
