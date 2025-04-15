const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true, maxlength: 20 },
  profileImage: { type: String },
}, { _id: false });

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    maxlength: 255,
  },
  user: {
    type: userSchema,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Message', messageSchema);