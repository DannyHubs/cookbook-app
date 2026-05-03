# Cookbook App - Backend

A Node.js + Express.js backend for managing **recipes** and **ingredients** with automatically calculated nutrition values.

This project was developed as part of homework #3 (Backend Development).

## 🍽️ Description

The Cookbook application allows you to:
- Create, edit, and delete **ingredients** with their nutrition values per 100g/ml
- Create, edit, and delete **recipes** that reference one or more ingredients
- Automatically calculate total nutrition values (calories, protein, carbs, fat) for each recipe based on its ingredients
- List recipes filtered by category (breakfast, lunch, dinner, snack, dessert, drink, other)

The application is **publicly accessible without registration or login** — there is no user/permission system.

## 📦 Data Entities

The application contains exactly two entities linked by a relationship:

```
┌─────────────────┐         ┌──────────────────┐
│   Ingredient    │ 1 ──── N│      Recipe      │
├─────────────────┤         ├──────────────────┤
│ id              │         │ id               │
│ name            │         │ name             │
│ unit            │         │ description      │
│ caloriesPer100  │         │ instructions     │
│ proteinPer100   │         │ preparationTime  │
│ carbsPer100     │         │ servings         │
│ fatPer100       │         │ category         │
└─────────────────┘         │ ingredientList[] │── references Ingredient
                            │ nutrition{}      │
                            └──────────────────┘
```

A **Recipe** contains many **Ingredient** references (with amount), and one **Ingredient** can be used in many recipes.

## 🛠️ Technology

- **Node.js** (v18+)
- **Express.js** — web framework
- **AJV** — JSON schema validation
- **uuid** — id generation
- **JSON files** — persistent storage (no database required)

## 🚀 Installation & Run

```bash
# Install dependencies
npm install

# Start the server
npm start

# Or for development with auto-reload
npm run dev
```

The server starts on `http://localhost:3000`.

## 🔌 API Endpoints

### Ingredient
| Method | URL                  | Description              |
|--------|----------------------|--------------------------|
| POST   | `/ingredient/create` | Create a new ingredient  |
| GET    | `/ingredient/get`    | Get an ingredient by id  |
| GET    | `/ingredient/list`   | List ingredients         |
| POST   | `/ingredient/update` | Update an ingredient     |
| POST   | `/ingredient/delete` | Delete an ingredient     |

### Recipe
| Method | URL              | Description                    |
|--------|------------------|--------------------------------|
| POST   | `/recipe/create` | Create a new recipe            |
| GET    | `/recipe/get`    | Get a recipe by id (enriched)  |
| GET    | `/recipe/list`   | List recipes (filter by category) |
| POST   | `/recipe/update` | Update a recipe                |
| POST   | `/recipe/delete` | Delete a recipe                |

## 📝 Example Usage

**1. Create an ingredient**
```bash
curl -X POST http://localhost:3000/ingredient/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chicken Breast",
    "unit": "g",
    "caloriesPer100": 165,
    "proteinPer100": 31,
    "carbsPer100": 0,
    "fatPer100": 3.6
  }'
```

**2. Create a recipe**
```bash
curl -X POST http://localhost:3000/recipe/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Grilled Chicken",
    "instructions": "Season and grill the chicken for 8 minutes per side.",
    "servings": 2,
    "category": "dinner",
    "ingredientList": [
      { "ingredientId": "<paste-ingredient-id-here>", "amount": 300 }
    ]
  }'
```

The response includes `nutrition` calculated automatically from the ingredients.

## 📁 Project Structure

```
cookbook-app/
├── src/
│   ├── abl/                    # Application Business Logic
│   │   ├── ingredient/
│   │   └── recipe/
│   ├── controllers/            # Express routers
│   ├── dao/                    # Data Access Objects
│   │   └── storage/            # JSON file storage
│   ├── validation-types/       # JSON Schema dtoIn types
│   ├── bin/                    # Entry point
│   └── app.js                  # Express app setup
├── package.json
└── README.md
```

## 📄 License

MIT
