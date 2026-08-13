const express = require('express');
const { body } = require('express-validator');
const {
  createShortUrl,
  getMyUrls,
  deleteUrl,
} = require('../controllers/url');
const { protect } = require('../middleware/auth');
const { createUrlLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// All routes below require authentication
router.use(protect);

router
  .route('/')
  .get(getMyUrls)
  .post(
    createUrlLimiter,
    [
      body('url').notEmpty().withMessage('URL is required'),
      body('customCode')
        .optional({ checkFalsy: true })
        .isLength({ min: 3, max: 20 })
        .withMessage('Custom code must be between 3 and 20 characters'),
    ],
    createShortUrl
  );

router.delete('/:id', deleteUrl);

module.exports = router;
