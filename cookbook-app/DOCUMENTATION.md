# Cookbook Application — Homework Documentation

## Assignment Summary

**Application:** Cookbook — allows users to create, edit and add recipes with nutrition values.

**Technology stack:** Node.js + Express.js  
**Data entities:** `Recipe` and `Ingredient` (linked by 1:N relationship — one Recipe contains many Ingredients)  
**Access:** Public (no authentication / no user permissions)

---

# 1. Schema Diagram

```
┌─────────────────────────────┐                ┌─────────────────────────────┐
│          RECIPE             │                │         INGREDIENT          │
├─────────────────────────────┤                ├─────────────────────────────┤
│ id            : string (PK) │  1          N  │ id           : string (PK)  │
│ name          : string      │ ◄────────────► │ recipeId     : string (FK)  │
│ description   : string      │     contains   │ name         : string       │
│ instructions  : string      │                │ amount       : number       │
│ servings      : number      │                │ unit         : string       │
│ prepTimeMin   : number      │                │ calories     : number       │
│ cookTimeMin   : number      │                │ protein      : number       │
│ category      : string      │                │ carbs        : number       │
│ totalCalories : number      │                │ fat          : number       │
│ createdAt     : datetime    │                │ createdAt    : datetime     │
│ updatedAt     : datetime    │                │ updatedAt    : datetime     │
└─────────────────────────────┘                └─────────────────────────────┘
```

**Relationship:** One `Recipe` contains many `Ingredients`. Each `Ingredient` belongs to exactly one `Recipe` via `recipeId`. Deleting a `Recipe` cascades — its ingredients are deleted as well.

> 💡 In the uuBmlDraw tool, draw two boxes connected with a 1:N relation labelled "contains".

---

# 2. Schema Name: Recipe

## Schema

```javascript
const recipeSchema = {
  id: "012...",                    // generated unique code
  name: "Spaghetti Bolognese",     // recipe name
  description: "Classic Italian pasta dish with meat sauce.",
  instructions: "1. Brown the meat. 2. Add tomato sauce...",
  servings: 4,                     // number of servings
  prepTimeMin: 15,                 // preparation time in minutes
  cookTimeMin: 45,                 // cooking time in minutes
  category: "main-course",         // breakfast | main-course | dessert | snack | drink
  totalCalories: 850,              // computed sum of ingredient calories
  createdAt: "2025-01-01T10:00:00Z",
  updatedAt: "2025-01-01T10:00:00Z"
};
```

## DAO Method List — Recipe

| Name | Description |
|------|-------------|
| `create (uuObject) -> uuObject` | creates a recipe in the schema |
| `get (id) -> uuObject` | returns a recipe by its id |
| `update (uuObject) -> uuObject` | updates an existing recipe |
| `delete (id) -> {}` | deletes a recipe (and cascades its ingredients) |
| `list (filter) -> uuObjectList` | returns list of recipes filtered by name/category |

---

# 3. Schema Name: Ingredient

## Schema

```javascript
const ingredientSchema = {
  id: "012...",                    // generated unique code
  recipeId: "012...",              // FK -> Recipe.id
  name: "Ground Beef",
  amount: 500,                     // numeric quantity
  unit: "g",                       // g | kg | ml | l | pcs | tbsp | tsp | cup
  calories: 250,                   // kcal per serving of this ingredient
  protein: 26,                     // grams
  carbs: 0,                        // grams
  fat: 17,                         // grams
  createdAt: "2025-01-01T10:00:00Z",
  updatedAt: "2025-01-01T10:00:00Z"
};
```

## DAO Method List — Ingredient

| Name | Description |
|------|-------------|
| `create (uuObject) -> uuObject` | creates an ingredient in the schema |
| `get (id) -> uuObject` | returns an ingredient by its id |
| `update (uuObject) -> uuObject` | updates an existing ingredient |
| `delete (id) -> {}` | deletes an ingredient |
| `listByRecipe (recipeId) -> uuObjectList` | returns all ingredients of a recipe |

---

# 4. Command Documentation

Below is the documentation of every command (API endpoint) of the application, following the prescribed template.

---

## Command Name: `recipeCreate`

### Basic Info

| Field | Value |
|-------|-------|
| Name | recipeCreate |
| Description | Creates a new recipe in the cookbook. |
| HTTP Method | POST |
| Url | `/recipe/create` |

This algorithm describes the creation of a new recipe and all possible errors and warnings that can happen during this process.

**Error prefix:** `cookbook-main/recipeCreate`

1. **[Sequence]** Validation of dtoIn.
   - 1.1. Calls the `validate` method for `dtoIn` by `recipeCreateDtoInType` and fills `validationResult` with it.
   - 1.2. **[Sequence]** Checks that no keys beyond the `recipeCreateDtoInType` are entered in `dtoIn`.
   - 1.3. **[Sequence]** `validationResult` must not contain wrong keys defined in `recipeCreateDtoInType`.
   - 1.4. Keys that are missing from `dtoIn` and require a default value (check the Default Values table) will be supplemented with the default value.
2. **[Sequence]** System generates a unique `id`, sets `createdAt`/`updatedAt` to the current timestamp, computes `totalCalories` (initially 0, recalculated when ingredients are added).
3. **[Sequence]** Persists the new recipe via `recipeDao.create(recipe)`.
4. **[Return]** Returns properly filled `dtoOut` (the created recipe object).

### Default Values

| Key | Default |
|-----|---------|
| servings | 1 |
| prepTimeMin | 0 |
| cookTimeMin | 0 |
| category | "main-course" |
| totalCalories | 0 |

### Error list

| Type | Code | Message | Parameters |
|------|------|---------|------------|
| Warning | `unsupportedKeys` | DtoIn contains unsupported keys. | `{ "unsupportedKeyList": {} }` |
| Error | `invalidDtoIn` | DtoIn is not valid. | `{ "invalidTypeKeyMap": {}, "invalidValueKeyMap": {}, "missingKeyMap": {} }` |
| Error | `recipeDaoCreateFailed` | Recipe could not be saved to the database. | `{ "cause": {} }` |

---

## Command Name: `recipeGet`

### Basic Info

| Field | Value |
|-------|-------|
| Name | recipeGet |
| Description | Returns a single recipe (including its ingredients) by id. |
| HTTP Method | GET |
| Url | `/recipe/get` |

This algorithm describes retrieval of a recipe and all possible errors and warnings that can happen during this process.

**Error prefix:** `cookbook-main/recipeGet`

1. **[Sequence]** Validation of dtoIn.
   - 1.1. Calls the `validate` method for `dtoIn` by `recipeGetDtoInType` and fills `validationResult` with it.
   - 1.2. **[Sequence]** Checks that no keys beyond the `recipeGetDtoInType` are entered in `dtoIn`.
   - 1.3. **[Sequence]** `validationResult` must not contain wrong keys defined in `recipeGetDtoInType`.
   - 1.4. Keys that are missing from `dtoIn` and require a default value will be supplemented with the default value.
2. **[Sequence]** Calls `recipeDao.get(id)`. If not found, throws `recipeNotFound` error.
3. **[Sequence]** Calls `ingredientDao.listByRecipe(id)` to attach the recipe's ingredients.
4. **[Return]** Returns properly filled `dtoOut` (recipe with embedded `ingredientList`).

### Error list

| Type | Code | Message | Parameters |
|------|------|---------|------------|
| Warning | `unsupportedKeys` | DtoIn contains unsupported keys. | `{ "unsupportedKeyList": {} }` |
| Error | `invalidDtoIn` | DtoIn is not valid. | `{ "invalidTypeKeyMap": {}, "invalidValueKeyMap": {}, "missingKeyMap": {} }` |
| Error | `recipeNotFound` | Recipe with given id was not found. | `{ "recipeId": "..." }` |

---

## Command Name: `recipeUpdate`

### Basic Info

| Field | Value |
|-------|-------|
| Name | recipeUpdate |
| Description | Updates an existing recipe. |
| HTTP Method | POST |
| Url | `/recipe/update` |

**Error prefix:** `cookbook-main/recipeUpdate`

1. **[Sequence]** Validation of dtoIn.
   - 1.1. Calls the `validate` method for `dtoIn` by `recipeUpdateDtoInType` and fills `validationResult` with it.
   - 1.2. **[Sequence]** Checks that no keys beyond the `recipeUpdateDtoInType` are entered in `dtoIn`.
   - 1.3. **[Sequence]** `validationResult` must not contain wrong keys defined in `recipeUpdateDtoInType`.
   - 1.4. Keys that are missing from `dtoIn` and require a default value will be supplemented with the default value.
2. **[Sequence]** Calls `recipeDao.get(id)` to verify the recipe exists. If not found, throws `recipeNotFound`.
3. **[Sequence]** Sets `updatedAt` to the current timestamp and calls `recipeDao.update(recipe)`.
4. **[Return]** Returns properly filled `dtoOut` (the updated recipe).

### Error list

| Type | Code | Message | Parameters |
|------|------|---------|------------|
| Warning | `unsupportedKeys` | DtoIn contains unsupported keys. | `{ "unsupportedKeyList": {} }` |
| Error | `invalidDtoIn` | DtoIn is not valid. | `{ "invalidTypeKeyMap": {}, "invalidValueKeyMap": {}, "missingKeyMap": {} }` |
| Error | `recipeNotFound` | Recipe with given id was not found. | `{ "recipeId": "..." }` |
| Error | `recipeDaoUpdateFailed` | Recipe could not be updated. | `{ "cause": {} }` |

---

## Command Name: `recipeDelete`

### Basic Info

| Field | Value |
|-------|-------|
| Name | recipeDelete |
| Description | Deletes a recipe and cascades deletion to all its ingredients. |
| HTTP Method | POST |
| Url | `/recipe/delete` |

**Error prefix:** `cookbook-main/recipeDelete`

1. **[Sequence]** Validation of dtoIn.
   - 1.1. Calls the `validate` method for `dtoIn` by `recipeDeleteDtoInType` and fills `validationResult` with it.
   - 1.2. **[Sequence]** Checks that no keys beyond the `recipeDeleteDtoInType` are entered in `dtoIn`.
   - 1.3. **[Sequence]** `validationResult` must not contain wrong keys defined in `recipeDeleteDtoInType`.
2. **[Sequence]** Cascades: calls `ingredientDao.listByRecipe(id)` and deletes each ingredient.
3. **[Sequence]** Calls `recipeDao.delete(id)`.
4. **[Return]** Returns properly filled `dtoOut` (empty object `{}`).

### Error list

| Type | Code | Message | Parameters |
|------|------|---------|------------|
| Warning | `unsupportedKeys` | DtoIn contains unsupported keys. | `{ "unsupportedKeyList": {} }` |
| Error | `invalidDtoIn` | DtoIn is not valid. | `{ "invalidTypeKeyMap": {}, "invalidValueKeyMap": {}, "missingKeyMap": {} }` |

---

## Command Name: `recipeList`

### Basic Info

| Field | Value |
|-------|-------|
| Name | recipeList |
| Description | Returns the list of recipes (with optional filtering by name/category). |
| HTTP Method | GET |
| Url | `/recipe/list` |

**Error prefix:** `cookbook-main/recipeList`

1. **[Sequence]** Validation of dtoIn.
   - 1.1. Calls the `validate` method for `dtoIn` by `recipeListDtoInType`.
   - 1.2. **[Sequence]** Checks that no keys beyond the `recipeListDtoInType` are entered in `dtoIn`.
   - 1.3. **[Sequence]** `validationResult` must not contain wrong keys defined in `recipeListDtoInType`.
   - 1.4. Missing optional filter keys are left undefined (no default applied).
2. **[Sequence]** Calls `recipeDao.list(filter)`.
3. **[Return]** Returns properly filled `dtoOut` containing `itemList` and `pageInfo`.

### Error list

| Type | Code | Message | Parameters |
|------|------|---------|------------|
| Warning | `unsupportedKeys` | DtoIn contains unsupported keys. | `{ "unsupportedKeyList": {} }` |
| Error | `invalidDtoIn` | DtoIn is not valid. | `{ "invalidTypeKeyMap": {}, "invalidValueKeyMap": {}, "missingKeyMap": {} }` |

---

## Command Name: `ingredientCreate`

### Basic Info

| Field | Value |
|-------|-------|
| Name | ingredientCreate |
| Description | Adds an ingredient to an existing recipe. |
| HTTP Method | POST |
| Url | `/ingredient/create` |

**Error prefix:** `cookbook-main/ingredientCreate`

1. **[Sequence]** Validation of dtoIn.
   - 1.1. Calls the `validate` method for `dtoIn` by `ingredientCreateDtoInType`.
   - 1.2. **[Sequence]** Checks that no keys beyond `ingredientCreateDtoInType` are entered in `dtoIn`.
   - 1.3. **[Sequence]** `validationResult` must not contain wrong keys defined in `ingredientCreateDtoInType`.
   - 1.4. Missing keys with defaults are filled in (see Default Values).
2. **[Sequence]** Verifies that the parent recipe exists via `recipeDao.get(recipeId)`. If not, throws `recipeNotFound`.
3. **[Sequence]** Persists the ingredient via `ingredientDao.create(ingredient)`.
4. **[Sequence]** Recomputes `recipe.totalCalories` as the sum of all its ingredients' calories and persists it.
5. **[Return]** Returns properly filled `dtoOut` (the created ingredient).

### Default Values

| Key | Default |
|-----|---------|
| unit | "g" |
| calories | 0 |
| protein | 0 |
| carbs | 0 |
| fat | 0 |

### Error list

| Type | Code | Message | Parameters |
|------|------|---------|------------|
| Warning | `unsupportedKeys` | DtoIn contains unsupported keys. | `{ "unsupportedKeyList": {} }` |
| Error | `invalidDtoIn` | DtoIn is not valid. | `{ "invalidTypeKeyMap": {}, "invalidValueKeyMap": {}, "missingKeyMap": {} }` |
| Error | `recipeNotFound` | Parent recipe does not exist. | `{ "recipeId": "..." }` |
| Error | `ingredientDaoCreateFailed` | Ingredient could not be saved. | `{ "cause": {} }` |

---

## Command Name: `ingredientGet`

### Basic Info

| Field | Value |
|-------|-------|
| Name | ingredientGet |
| Description | Returns a single ingredient by id. |
| HTTP Method | GET |
| Url | `/ingredient/get` |

**Error prefix:** `cookbook-main/ingredientGet`

1. **[Sequence]** Validation of dtoIn (analogous to recipe commands).
2. **[Sequence]** Calls `ingredientDao.get(id)`. If not found, throws `ingredientNotFound`.
3. **[Return]** Returns properly filled `dtoOut`.

### Error list

| Type | Code | Message | Parameters |
|------|------|---------|------------|
| Warning | `unsupportedKeys` | DtoIn contains unsupported keys. | `{ "unsupportedKeyList": {} }` |
| Error | `invalidDtoIn` | DtoIn is not valid. | `{ "invalidTypeKeyMap": {}, "invalidValueKeyMap": {}, "missingKeyMap": {} }` |
| Error | `ingredientNotFound` | Ingredient with given id was not found. | `{ "ingredientId": "..." }` |

---

## Command Name: `ingredientUpdate`

### Basic Info

| Field | Value |
|-------|-------|
| Name | ingredientUpdate |
| Description | Updates an existing ingredient. |
| HTTP Method | POST |
| Url | `/ingredient/update` |

**Error prefix:** `cookbook-main/ingredientUpdate`

1. **[Sequence]** Validation of dtoIn (analogous to other commands).
2. **[Sequence]** Verifies the ingredient exists via `ingredientDao.get(id)`. If not, throws `ingredientNotFound`.
3. **[Sequence]** Sets `updatedAt`, calls `ingredientDao.update(ingredient)`.
4. **[Sequence]** Recomputes the parent recipe's `totalCalories`.
5. **[Return]** Returns properly filled `dtoOut`.

### Error list

| Type | Code | Message | Parameters |
|------|------|---------|------------|
| Warning | `unsupportedKeys` | DtoIn contains unsupported keys. | `{ "unsupportedKeyList": {} }` |
| Error | `invalidDtoIn` | DtoIn is not valid. | `{ "invalidTypeKeyMap": {}, "invalidValueKeyMap": {}, "missingKeyMap": {} }` |
| Error | `ingredientNotFound` | Ingredient with given id was not found. | `{ "ingredientId": "..." }` |

---

## Command Name: `ingredientDelete`

### Basic Info

| Field | Value |
|-------|-------|
| Name | ingredientDelete |
| Description | Removes an ingredient from a recipe. |
| HTTP Method | POST |
| Url | `/ingredient/delete` |

**Error prefix:** `cookbook-main/ingredientDelete`

1. **[Sequence]** Validation of dtoIn.
2. **[Sequence]** Calls `ingredientDao.delete(id)`.
3. **[Sequence]** Recomputes the parent recipe's `totalCalories`.
4. **[Return]** Returns properly filled `dtoOut` (empty object `{}`).

### Error list

| Type | Code | Message | Parameters |
|------|------|---------|------------|
| Warning | `unsupportedKeys` | DtoIn contains unsupported keys. | `{ "unsupportedKeyList": {} }` |
| Error | `invalidDtoIn` | DtoIn is not valid. | `{ "invalidTypeKeyMap": {}, "invalidValueKeyMap": {}, "missingKeyMap": {} }` |

---

## Command Name: `ingredientListByRecipe`

### Basic Info

| Field | Value |
|-------|-------|
| Name | ingredientListByRecipe |
| Description | Returns all ingredients of a given recipe. |
| HTTP Method | GET |
| Url | `/ingredient/listByRecipe` |

**Error prefix:** `cookbook-main/ingredientListByRecipe`

1. **[Sequence]** Validation of dtoIn.
2. **[Sequence]** Calls `ingredientDao.listByRecipe(recipeId)`.
3. **[Return]** Returns properly filled `dtoOut` (`itemList`).

### Error list

| Type | Code | Message | Parameters |
|------|------|---------|------------|
| Warning | `unsupportedKeys` | DtoIn contains unsupported keys. | `{ "unsupportedKeyList": {} }` |
| Error | `invalidDtoIn` | DtoIn is not valid. | `{ "invalidTypeKeyMap": {}, "invalidValueKeyMap": {}, "missingKeyMap": {} }` |
