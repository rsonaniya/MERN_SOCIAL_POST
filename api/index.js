const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db.js");
const postRoutes = require("./routes/postRoute.js");

const app = express();
const port = 5000;

connectDB();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", postRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
