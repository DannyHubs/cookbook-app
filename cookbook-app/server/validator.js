/**
 * Lightweight validator that follows the validation flow described in the
 * homework's Command Name template:
 *   1.1 validate dtoIn against type schema
 *   1.2 detect unsupported keys (warning)
 *   1.3 fail if there are wrong-type / missing keys (error)
 *   1.4 fill in default values
 */

const AppError = require("./app-error");

function validateDtoIn(dtoIn, schema, errorPrefix) {
  if (typeof dtoIn !== "object" || dtoIn === null || Array.isArray(dtoIn)) {
    throw new AppError(
      `${errorPrefix}/invalidDtoIn`,
      "DtoIn is not valid.",
      { invalidTypeKeyMap: { _root: "expected object" }, invalidValueKeyMap: {}, missingKeyMap: {} }
    );
  }

  const result = { ...dtoIn };
  const allowedKeys = Object.keys(schema);

  // 1.2 detect unsupported keys -> warning
  const unsupportedKeyList = Object.keys(dtoIn).filter((k) => !allowedKeys.includes(k));
  const warnings = [];
  if (unsupportedKeyList.length > 0) {
    warnings.push({
      code: `${errorPrefix}/unsupportedKeys`,
      message: "DtoIn contains unsupported keys.",
      params: { unsupportedKeyList }
    });
    for (const k of unsupportedKeyList) delete result[k];
  }

  // 1.3 type / missing-key check
  const invalidTypeKeyMap = {};
  const invalidValueKeyMap = {};
  const missingKeyMap = {};

  for (const [key, def] of Object.entries(schema)) {
    const value = result[key];
    const isMissing = value === undefined || value === null || value === "";

    if (isMissing) {
      if (def.required) {
        missingKeyMap[key] = `key "${key}" is required`;
      } else if (Object.prototype.hasOwnProperty.call(def, "default")) {
        // 1.4 default value
        result[key] = def.default;
      }
      continue;
    }

    if (def.type === "number") {
      // accept numeric strings from query params
      if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
        result[key] = Number(value);
      } else if (typeof value !== "number" || Number.isNaN(value)) {
        invalidTypeKeyMap[key] = `expected number, got ${typeof value}`;
        continue;
      }
      const numVal = result[key];
      if (def.min !== undefined && numVal < def.min) {
        invalidValueKeyMap[key] = `must be >= ${def.min}`;
      }
    } else if (def.type === "string") {
      if (typeof value !== "string") {
        invalidTypeKeyMap[key] = `expected string, got ${typeof value}`;
        continue;
      }
      if (def.enum && !def.enum.includes(value)) {
        invalidValueKeyMap[key] = `must be one of: ${def.enum.join(", ")}`;
      }
      if (def.maxLength !== undefined && value.length > def.maxLength) {
        invalidValueKeyMap[key] = `must be at most ${def.maxLength} characters`;
      }
    } else if (def.type === "boolean") {
      if (typeof value !== "boolean") {
        invalidTypeKeyMap[key] = `expected boolean, got ${typeof value}`;
      }
    }
  }

  if (
    Object.keys(invalidTypeKeyMap).length > 0 ||
    Object.keys(invalidValueKeyMap).length > 0 ||
    Object.keys(missingKeyMap).length > 0
  ) {
    throw new AppError(
      `${errorPrefix}/invalidDtoIn`,
      "DtoIn is not valid.",
      { invalidTypeKeyMap, invalidValueKeyMap, missingKeyMap }
    );
  }

  return { dtoIn: result, warnings };
}

module.exports = { validateDtoIn };
