const Url = require('../models/Url');
const validateUrl = require('../utils/validateUrl');
const generateUniqueId = require('../utils/generateUniqueId');
const { validationResult } = require('express-validator');

// @desc    Create a short URL
// @route   POST /api/urls
// @access  Private
exports.createShortUrl = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }

  const { url, customCode } = req.body;
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;

  if (!validateUrl(url)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid URL (must start with http:// or https://)',
    });
  }

  // Validate custom code format if provided
  if (customCode) {
    if (!/^[a-zA-Z0-9_-]{3,20}$/.test(customCode)) {
      return res.status(400).json({
        success: false,
        message:
          'Custom code must be 3-20 characters and contain only letters, numbers, hyphens or underscores',
      });
    }
  }

  try {
    // Check if this user already shortened the same URL
    const existing = await Url.findOne({ url, user: req.user._id });
    if (existing) {
      return res.status(200).json({
        success: true,
        data: {
          id: existing._id,
          originalUrl: existing.url,
          shortUrl: `${baseUrl}/${existing.shortUrlId}`,
          shortUrlId: existing.shortUrlId,
          clicks: existing.clicks,
          customCode: existing.customCode,
          createdAt: existing.createdAt,
        },
        message: 'You already have a short link for this URL',
      });
    }

    const shortUrlId = await generateUniqueId(customCode || null);

    const newUrl = await Url.create({
      url,
      shortUrlId,
      customCode: !!customCode,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: {
        id: newUrl._id,
        originalUrl: newUrl.url,
        shortUrl: `${baseUrl}/${newUrl.shortUrlId}`,
        shortUrlId: newUrl.shortUrlId,
        clicks: newUrl.clicks,
        customCode: newUrl.customCode,
        createdAt: newUrl.createdAt,
      },
    });
  } catch (err) {
    if (err.statusCode === 409) {
      return res.status(409).json({
        success: false,
        message: err.message,
      });
    }
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error while creating short URL',
    });
  }
};

// @desc    Get all URLs for the logged-in user
// @route   GET /api/urls
// @access  Private
exports.getMyUrls = async (req, res) => {
  try {
    const urls = await Url.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('-__v');

    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;

    const formatted = urls.map((u) => ({
      id: u._id,
      originalUrl: u.url,
      shortUrl: `${baseUrl}/${u.shortUrlId}`,
      shortUrlId: u.shortUrlId,
      clicks: u.clicks,
      customCode: u.customCode,
      createdAt: u.createdAt,
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching URLs',
    });
  }
};

// @desc    Redirect to original URL + increment clicks
// @route   GET /:shortUrlId
// @access  Public
exports.redirectToOriginalUrl = async (req, res) => {
  try {
    const urlDoc = await Url.findOne({ shortUrlId: req.params.shortUrlId });

    if (!urlDoc) {
      return res.status(404).json({
        success: false,
        message: 'Short URL not found',
      });
    }

    // Increment clicks
    urlDoc.clicks += 1;
    await urlDoc.save();

    return res.redirect(urlDoc.url);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Delete a URL (only owner)
// @route   DELETE /api/urls/:id
// @access  Private
exports.deleteUrl = async (req, res) => {
  try {
    const urlDoc = await Url.findById(req.params.id);

    if (!urlDoc) {
      return res.status(404).json({
        success: false,
        message: 'URL not found',
      });
    }

    // Ownership check
    if (urlDoc.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this URL',
      });
    }

    await urlDoc.deleteOne();

    res.status(200).json({
      success: true,
      message: 'URL deleted successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting URL',
    });
  }
};
