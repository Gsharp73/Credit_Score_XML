const express = require("express");
const UploadHistory = require("../models/history.js"); 

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const history = await UploadHistory.find().sort({ uploadTime: -1 });
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: "Error fetching upload history." });
  }
});

module.exports = router;