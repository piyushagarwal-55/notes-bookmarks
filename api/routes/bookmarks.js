const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');
const { protect } = require('../middleware/auth');

// Helper function to fetch title from URL
const fetchTitleFromUrl = async (url) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 5000
    });
    
    if (!response.ok) {
      return null;
    }
    
    const html = await response.text();
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return titleMatch ? titleMatch[1].trim() : null;
  } catch (error) {
    console.error('Error fetching title:', error);
    return null;
  }
};

// @desc    Create a new bookmark
// @route   POST /api/bookmarks
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    let { url, title, tags, isFavorite } = req.body;

    // Auto-fetch title if not provided
    if (!title || title.trim() === '') {
      const fetchedTitle = await fetchTitleFromUrl(url);
      title = fetchedTitle || 'Untitled Bookmark';
    }

    const bookmark = await Bookmark.create({
      url,
      title,
      tags: tags || [],
      isFavorite: isFavorite || false,
      userId: req.user._id
    });

    res.status(201).json({
      success: true,
      data: bookmark
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get all bookmarks for logged in user
// @route   GET /api/bookmarks
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { q, tags, favorites } = req.query;
    let query = { userId: req.user._id };

    // Search functionality
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { url: { $regex: q, $options: 'i' } }
      ];
    }

    // Tag filtering
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      query.tags = { $in: tagArray };
    }

    // Favorites filtering
    if (favorites === 'true') {
      query.isFavorite = true;
    }

    const bookmarks = await Bookmark.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

    res.json({
      success: true,
      count: bookmarks.length,
      data: bookmarks
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get single bookmark
// @route   GET /api/bookmarks/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('userId', 'name email');

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found'
      });
    }

    res.json({
      success: true,
      data: bookmark
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Update bookmark
// @route   PUT /api/bookmarks/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let bookmark = await Bookmark.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found'
      });
    }

    // Auto-fetch title if title is being set to empty
    if (req.body.hasOwnProperty('title') && (!req.body.title || req.body.title.trim() === '')) {
      const fetchedTitle = await fetchTitleFromUrl(req.body.url || bookmark.url);
      req.body.title = fetchedTitle || 'Untitled Bookmark';
    }

    bookmark = await Bookmark.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: bookmark
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Delete bookmark
// @route   DELETE /api/bookmarks/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found'
      });
    }

    await Bookmark.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Bookmark deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Toggle favorite status
// @route   PATCH /api/bookmarks/:id/favorite
// @access  Private
router.patch('/:id/favorite', protect, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found'
      });
    }

    bookmark.isFavorite = !bookmark.isFavorite;
    await bookmark.save();

    res.json({
      success: true,
      data: bookmark
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router; 