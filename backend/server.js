require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const uploadRoutes = require("./routes/uploadRoute");
const reportRoutes = require("./routes/reportRoute");
const deleteRoutes = require("./routes/deleteRoute");
const historyRoutes = require("./routes/historyRoute")

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(fileUpload());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB Connection Error: ", err));

app.use("/upload", uploadRoutes);
app.use("/reports", reportRoutes);
app.use("/delete", deleteRoutes);
app.use("/history", historyRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running smoothly." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));