const { nanoid } = require('nanoid');
const Url = require('../models/Url');

/**
 * Generate a unique short ID.
 * Optionally accepts a preferred custom code.
 * Returns the final shortUrlId to use.
 */
module.exports = async (preferredCode = null) => {
  // If a custom code is provided, check availability
  if (preferredCode) {
    const existing = await Url.findOne({ shortUrlId: preferredCode });
    if (existing) {
      const error = new Error('Custom code already taken');
      error.statusCode = 409;
      throw error;
    }
    return preferredCode;
  }

  // Auto-generate a unique 7-character ID
  let shortUrlId;
  let exists = true;

  while (exists) {
    shortUrlId = nanoid(7);
    const found = await Url.findOne({ shortUrlId });
    exists = !!found;
  }

  return shortUrlId;
};
