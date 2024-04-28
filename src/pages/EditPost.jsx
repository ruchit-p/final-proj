import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../../client";
import { Button } from "../components/ui/button";

function EditPost() {
  const [post, setPost] = useState({ title: "", content: "", imageURL: "" });
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error("Error fetching post:", error);
      navigate("/"); // Redirect to home if there's an error fetching the post
    } else {
      setPost(data);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from("posts")
      .update({
        title: post.title,
        content: post.content,
        imageURL: post.imageURL,
        videoURL: post.videoURL,
      })
      .eq("id", id);

    setLoading(false);

    if (error) {
      console.error("Error updating post:", error);
    } else {
      navigate(`/post/${id}`); // Redirect to the post detail page after update
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 w-full flex flex-col justify-items-center">
      <Button onClick={() => navigate(`/post/${id}`)} className="mb-4 w-16">
        Back
      </Button>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Post</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-title"
            >
              Title
            </label>
            <input
              className="appearance-none block w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="grid-title"
              type="text"
              placeholder="Enter title"
              name="title"
              value={post.title}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-content"
            >
              Content
            </label>
            <textarea
              className="appearance-none block w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="grid-content"
              placeholder="Enter content"
              name="content"
              value={post.content}
              onChange={handleInputChange}
              rows="4"
            ></textarea>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-image-url"
            >
              Image URL
            </label>
            <input
              className="appearance-none block w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="grid-image-url"
              type="text"
              placeholder="Enter image URL"
              name="imageURL"
              value={post.imageURL}
              onChange={handleInputChange}
            />
          </div>
        </div>
        {/* Video URL */}
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-video-url"
            >
              Video URL
            </label>
            <input
              className="appearance-none block w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="grid-video-url"
              type="text"
              placeholder="Enter video URL"
              name="videoURL"
              value={post.videoURL}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mt-6">
          <div className="w-full px-3 text-right">
            <Button
              type="submit"
              className="shadow bg-teal-400 hover:bg-teal-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Post"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditPost;
