import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [loadingPost, setLoadingPost] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoadingPost(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/getpost/${id}`
        );
        const post = response.data.post;
        setTitle(post.title);
        setDescription(post.description);
        setExistingImage(post.image);
        setLoadingPost(false);
      } catch (err) {
        console.error("Error fetching post:", err);
        setLoadingPost(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    if (image) {
      formData.append("image", image);
    }

    try {
      setLoadingEdit(true);
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/updatepost/${id}`,
        formData
      );
      setLoadingEdit(false);
      navigate("/");
    } catch (error) {
      console.error("Error updating post:", error);
      setLoadingEdit(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <div>
      <h1>Edit Post</h1>
      {loadingPost ? (
        <h3 style={{ textAlign: "center" }}>
          Loading Post Details, Please wait...
        </h3>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Image:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {existingImage && !image && (
              <div>
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}${existingImage}`}
                  alt="Current Post"
                  style={{ width: "150px", height: "150px" }}
                />
              </div>
            )}
          </div>
          <div>
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <button type="submit" disabled={loadingEdit}>
            {loadingEdit ? "Editing Post, Please Wait" : "Update Post"}
          </button>
        </form>
      )}
    </div>
  );
};

export default EditPost;
