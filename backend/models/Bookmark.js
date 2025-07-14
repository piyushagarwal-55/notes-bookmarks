const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Please provide a valid URL starting with http:// or https://'
    }
  },
  title: {
    type: String,
    trim: true,
    maxlength: [300, 'Title must be less than 300 characters']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [50, 'Tag must be less than 50 characters']
  }],
  isFavorite: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
bookmarkSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better performance
bookmarkSchema.index({ userId: 1, createdAt: -1 });
bookmarkSchema.index({ userId: 1, tags: 1 });
bookmarkSchema.index({ userId: 1, title: 'text', url: 'text' });

module.exports = mongoose.model('Bookmark', bookmarkSchema); 