"use strict";

const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({ allErrors: true, strict: false, useDefaults: true });
addFormats(ajv);

/**
 * Validates a dtoIn against a JSON schema.
 * Returns a validationResult object containing:
 *   - valid: boolean
 *   - invalidTypeKeyMap: keys that have a wrong type
 *   - invalidValueKeyMap: keys whose values are otherwise invalid
 *   - missingKeyMap: required keys missing in dtoIn
 *   - unsupportedKeyList: keys in dtoIn that are not defined in the schema
 */
function validate(dtoIn, schema) {
  const result = {
    valid: true,
    invalidTypeKeyMap: {},
    invalidValueKeyMap: {},
    missingKeyMap: {},
    unsupportedKeyList: []
  };

  const validateFn = ajv.compile(schema);
  const valid = validateFn(dtoIn);

  // Detect unsupported keys (keys in dtoIn but not in the schema's properties)
  const allowedKeys = Object.keys(schema.properties || {});
  for (const key of Object.keys(dtoIn || {})) {
    if (!allowedKeys.includes(key)) {
      result.unsupportedKeyList.push(key);
    }
  }

  if (!valid) {
    for (const err of validateFn.errors || []) {
      const path = err.instancePath.replace(/^\//, "") || err.params.missingProperty || "";

      if (err.keyword === "required") {
        result.missingKeyMap[err.params.missingProperty] = err.message;
      } else if (err.keyword === "type") {
        result.invalidTypeKeyMap[path] = err.message;
      } else if (err.keyword === "additionalProperties") {
        // already handled by unsupportedKeyList
      } else {
        result.invalidValueKeyMap[path] = err.message;
      }
    }
    result.valid = Object.keys(result.invalidTypeKeyMap).length === 0
      && Object.keys(result.invalidValueKeyMap).length === 0
      && Object.keys(result.missingKeyMap).length === 0;
  }

  return result;
}

module.exports = { validate };
