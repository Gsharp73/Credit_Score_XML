const mongoose = require("mongoose");
const UploadHistorySchema = new mongoose.Schema({
  pan: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  uploadTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UploadHistory", UploadHistorySchema);
