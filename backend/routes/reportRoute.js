const express = require("express");
const Report = require("../models/Report");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reports." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found." });
    }
    res.status(200).json(report);
  } catch (err) {
    res.status(500).json({ message: "Error fetching report." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Report deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Error deleting report." });
  }
});

module.exports = router;
