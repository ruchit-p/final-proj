import React, { useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import supabase from "../../client";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [videoURL, setVideoURL] = useState("");

  const navigate = useNavigate();

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = getCookie("guestUserId") || "guest-default";

    // Insert the new post into the database
    const { data, error } = await supabase
      .from("posts") // The table you want to insert into
      .insert([
        {
          title,
          content,
          // Assuming 'username' should be taken from the user's session or another state
          // If it's a field on the form, include it in the insert object
          imageURL,
          created_at: new Date().toISOString(), // Using created_at field for timestamp
          username,
          secretKey,
          videoURL,
        },
      ]);

    if (error) {
      console.error("Error creating post:", error);
      return;
    }

    // Log the inserted data or handle it as needed
    console.log("Created post:", data);

    // Reset form fields
    setTitle("");
    setContent("");
    setImageURL("");
    setSecretKey("");

    // Redirect to the home page after creating the post
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <Label
            htmlFor="title"
            className="block text-gray-700 text-sm font-bold mb-2"
            style={{ width: "300px" }}
          >
            Title:
          </Label>
          <Input
            id="title"
            type="text"
            placeholder="Title"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <Label
            htmlFor="content"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Content (Optional):
          </Label>
          <Textarea
            id="content"
            placeholder="Content"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <Label
            htmlFor="imageURL"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Image URL (Optional):
          </Label>
          <Input
            id="imageURL"
            type="text"
            placeholder="Image URL"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Label
            htmlFor="videoURL"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Video URL (Optional):
          </Label>
          <Input
            id="videoURL"
            type="text"
            placeholder="Video URL"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={videoURL}
            onChange={(e) => setVideoURL(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <Label
            htmlFor="secretKey"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Secret Key <span className="text-red-400">*</span>:
          </Label>
          <Input
            id="secretKey"
            type="text"
            placeholder="Secret Key"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={secretKey}
            required
            onChange={(e) => setSecretKey(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Post
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
