/**
 * Removes specified keys directly from the input data object (mutates in place).
 *
 * @param data The data object to remove keys from. Must be an object. This object will be modified.
 * @param keysToRemove An array of strings representing the keys to remove from the data object.
 * @returns void (modifies the data object directly)
 */
export const removeFields = <T extends Record<string, unknown>>(
  data: T,
  keysToRemove: string[]
) => {
  if (typeof data !== 'object' || data === null) {
    return; // Or you could throw an error if you prefer for invalid input in mutation scenario
  }

  for (const key of keysToRemove) {
    // Iterate through keysToRemove directly
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      delete data[key]; // Use delete operator to remove the key directly from data
    }
  }
};

export const clearUndefinedFieldsInPlace = <T extends Record<string, unknown>>(obj: T) => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (obj[key] === undefined) {
        delete obj[key];
      }
    }
  }
};
