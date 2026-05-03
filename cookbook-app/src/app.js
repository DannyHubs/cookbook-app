"use strict";

const express = require("express");
const recipeController = require("./controllers/recipe-controller");
const ingredientController = require("./controllers/ingredient-controller");

const app = express();

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    name: "Cookbook API",
    version: "1.0.0",
    description: "Manage recipes and ingredients with nutrition values",
    endpoints: {
      recipe: [
        "POST   /recipe/create",
        "GET    /recipe/get?id=:id",
        "GET    /recipe/list",
        "POST   /recipe/update",
        "POST   /recipe/delete"
      ],
      ingredient: [
        "POST   /ingredient/create",
        "GET    /ingredient/get?id=:id",
        "GET    /ingredient/list",
        "POST   /ingredient/update",
        "POST   /ingredient/delete"
      ]
    }
  });
});

// Recipe endpoints
app.use("/recipe", recipeController);

// Ingredient endpoints
app.use("/ingredient", ingredientController);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    code: "endpointNotFound",
    message: `Endpoint ${req.method} ${req.path} not found.`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    code: "internalServerError",
    message: err.message || "Internal server error."
  });
});

module.exports = app;
