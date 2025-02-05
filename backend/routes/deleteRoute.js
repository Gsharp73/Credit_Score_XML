const express = require("express");
const Report = require("../models/Report");

const router = express.Router();

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReport = await Report.findByIdAndDelete(id);
    if (!deletedReport) {
      return res.status(404).json({ message: "Report not found." });
    }
    res.status(200).json({ message: "Report deleted successfully." });
  } catch (error) {
    console.error("Error deleting report: ", error);
    res.status(500).json({ message: "Error deleting report." });
  }
});

module.exports = router;