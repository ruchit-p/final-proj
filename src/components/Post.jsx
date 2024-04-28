import React from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext"; // Import useAuth
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";

const Post = ({
  id,
  username,
  title,
  content,
  imageURL,
  videoURL,
  upvotes,
  postedAt,
  onUpvote,
  showImages,
  showContent,
  showVideos,
}) => {
  // Check if the current user has already upvoted the post
  const { user } = useAuth(); // Get the current user from the context
  const hasUpvoted = upvotes.includes(user?.email); // Check if current user upvoted
  const totalUpvotes = upvotes.length;
  const navigate = useNavigate();

  const handleUpvoteClick = (event) => {
    // Prevent the click event from bubbling up to the parent elements
    event.stopPropagation();

    if (!hasUpvoted) {
      onUpvote(id, username); // Pass the post id and the current user's username
    }
  };

  return (
    <div className="post" key={id} onClick={() => navigate(`/post/${id}`)}>
      <div className="post-header flex justify-between items-center">
        <div className="user-info">
          <h2 className="">{title}</h2>
          
        </div>
        <div className="upvotes flex items-center gap-2">
          <h1 className="text-lg">{totalUpvotes} upvotes</h1>
          <Button
            className={`flex items-center justify-center p-2 rounded ${
              hasUpvoted ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"
            } text-white`}
            onClick={handleUpvoteClick}
            disabled={hasUpvoted}
          >
            <ArrowUp size={24} />
          </Button>
        </div>
      </div>
      {imageURL && showImages && (
        <img src={imageURL} alt={title} className="post-image w-96 my-4 " />
      )}
      {videoURL && showVideos && <ReactPlayer url={videoURL} controls={true} />}

      {content && showContent && <p className="post-content">{content}</p>}
      <div className="mt-5">
      <strong>{username}</strong>
          <p className="text-sm">{postedAt}</p>
      </div>
    </div>
  );
};

export default Post;
