const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/postController.js");

const router = express.Router();

const uploadsDir = path.join(__dirname, "../public/uploads");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post("/createpost", upload.single("image"), createPost);
router.get("/getposts", getPosts);
router.get("/getpost/:id", getPostById);
router.put("/updatepost/:id", upload.single("image"), updatePost);
router.delete("/deletepost/:id", deletePost);

module.exports = router;
