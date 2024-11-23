import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/getposts`
        );
        setPosts(response.data.posts);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError("Error fetching posts.");
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/deletepost/${id}`
      );
      setPosts(posts.filter((post) => post._id !== id));
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Error deleting post.");
    }
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <Link to="/create-post" className="home-create-post-link">
          Create New Post
        </Link>
      </div>

      <div className="home-posts-container">
        <h3 className="home-posts-title">Post List</h3>
        {loading && <p className="home-loading-text">Loading posts...</p>}
        {error && <p className="home-error-text">{error}</p>}

        {!loading && !error && (
          <div className="home-posts-grid">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post._id} className="home-post-card">
                  <h6 className="home-title">{post.title}</h6>
                  {post.image && (
                    <Link to={`/post/${post._id}`}>
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL}${
                          post.image
                        }`}
                        alt={post.title}
                        className="home-post-image"
                      />
                    </Link>
                  )}
                  <div className="home-post-actions">
                    <Link
                      to={`/edit-post/${post._id}`}
                      className="home-edit-link"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(post._id);
                      }}
                      className="home-delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="home-no-posts-text">No posts available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
