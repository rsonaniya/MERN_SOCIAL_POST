const Post = require("../models/Post");
const path = require("path");
const fs = require("fs");

exports.createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newPost = new Post({ title, description, image });
    await newPost.save();

    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Error creating post." });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({ posts });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Error fetching posts." });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    res.status(200).json({ post });
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ message: "Error fetching post." });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const updatedPost = {
      title: title || post.title,
      description: description || post.description,
      image: req.file ? `/uploads/${req.file.filename}` : post.image,
    };

    const result = await Post.findByIdAndUpdate(req.params.id, updatedPost, {
      new: true,
    });

    res
      .status(200)
      .json({ message: "Post updated successfully", post: result });
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ message: "Error updating post." });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (post.image) {
      const imagePath = path.join(__dirname, "../public", post.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Error deleting post." });
  }
};
