/* eslint no-underscore-dangle: 0 */

const mongoose = require('mongoose');

const { Schema } = mongoose;

var SongSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  artist: { type: String, required: true, max: 100 },
  link: { type: String, required: true, max: 100 },
  upvotes: { type: Number, required: false, default: 0 },
  downvotes: { type: Number, required: false, default: 0 }
});

// Virtual for author's URL
SongSchema.virtual('url').get(function() {
  return `/song/${this._id}`;
});

// Virtual for ranking
SongSchema.virtual('rank').get(function() {
  return this.upvotes - this.downvotes;
});

// Virtual for decoded youtube
SongSchema.virtual('youtube').get(function() {
  return this.link.replace('watch', 'embed');
});

// Export model
module.exports = mongoose.model('Song', SongSchema);
