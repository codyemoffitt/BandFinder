/* eslint no-underscore-dangle: 0 */

const mongoose = require('mongoose');

const { Schema } = mongoose;

var SongSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  artist: { type: String, required: true, max: 100 },
  link: { type: String, required: true, max: 100 },
  upvotes: { type: Number, required: false, default: 0 },
  downvotes: { type: Number, required: false, default: 0 },
  votes: [
    {
      id: { type: String, required: true },
      displayName: { type: String, required: true },
      value: { type: Number, required: true }
    }
  ]
});

// Virtual for song's URL
SongSchema.virtual('url').get(function() {
  return `/songs/song/${this._id}`;
});

// Virtual for ranking
SongSchema.virtual('rank').get(function() {
  return this.upvotes - this.downvotes;
});

// Export model
module.exports = mongoose.model('Song', SongSchema);
