const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { protect } = require('../middleware/auth');

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, tags, isFavorite } = req.body;

    const note = await Note.create({
      title,
      content,
      tags: tags || [],
      isFavorite: isFavorite || false,
      userId: req.user._id
    });

    res.status(201).json({
      success: true,
      data: note
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get all notes for logged in user
// @route   GET /api/notes
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { q, tags, favorites } = req.query;
    let query = { userId: req.user._id };

    // Search functionality
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } }
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

    const notes = await Note.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');

    res.json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('userId', 'name email');

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let note = await Note.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Toggle favorite status
// @route   PATCH /api/notes/:id/favorite
// @access  Private
router.patch('/:id/favorite', protect, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    note.isFavorite = !note.isFavorite;
    await note.save();

    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router; 