/**
 * Improved URL validation using the URL constructor.
 * Accepts only http and https protocols.
 */
module.exports = (value) => {
  if (!value || typeof value !== 'string') return false;

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};
