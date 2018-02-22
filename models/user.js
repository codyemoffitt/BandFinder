const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, max: 100 },
  family_name: { type: String, required: true, max: 100 },
  date_of_birth: { type: Date },
  zipcode: { type: Number, required: true },
  instrument: { type: String, required: true, max: 100 }
});

// Virtual for author's URL
UserSchema.virtual('url').get(function() {
  return `/user/${this._id}`;
});

// Export model
module.exports = mongoose.model('User', UserSchema);
