import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/getpost/${id}`);
        setPost(response.data.post);
        setLoading(false);
      } catch (err) {
        setError('Error fetching post details.');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <p className="loading-text">Loading post...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="post-detail-container">
      <div className="post-header">
        <h1 className="post-title">{post.title}</h1>
      </div>
      {post.image && (
        <div className="post-image-container">
          <img
            src={`http://localhost:5000${post.image}`}
            alt={post.title}
            className="post-image"
          />
        </div>
      )}
      <div className="post-description-container">
        <p className="post-description">{post.description}</p>
      </div>
      <div className="back-button-container">
        <button
          className="back-button"
          onClick={() => window.history.back()}
        >
          Back to Posts List
        </button>
      </div>
    </div>
  );
};

export default PostDetail;
