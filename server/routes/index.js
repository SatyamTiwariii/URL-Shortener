const express = require('express');
const { redirectToOriginalUrl } = require('../controllers/url');

const router = express.Router();

// Public redirect route (must stay at root level)
router.get('/:shortUrlId', redirectToOriginalUrl);

// Health check
router.get('/', (req, res) => {
  res.json({ success: true, message: 'URL Shortener API is running' });
});

module.exports = router;
