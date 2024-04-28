import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../client";
import { Button } from "../components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal } from "lucide-react";
import { ArrowUp } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // import useAuth
import { useNavigate } from "react-router-dom";
import { CheckSecret } from "@/components/checkSecret";
import ReactPlayer from "react-player";

function PostPage() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState(""); // State to hold the new comment text
  const [showCheckSecret, setShowCheckSecret] = useState(false);
  const [actionType, setActionType] = useState(null);
  const { user } = useAuth(); // Get the logged-in user
  const { id } = useParams();
  const navigate = useNavigate();

  const hasUpvoted = post?.upvotes?.includes(user?.email);

  const handleEditPost = () => {
    if (actionType === "edit") {
      navigate(`/post/${post.id}/edit`);
    }
  };

  const handleDeletePost = async () => {
    if (actionType === "delete") {
      try {
        const { data, error } = await supabase
          .from("posts")
          .delete()
          .eq("id", id);
      } catch (error) {
        console.error("Error deleting post:", error);
      }
      navigate("/");
    }
  };

  const handlePostAction = () => {
    if (actionType === "edit") {
      handleEditPost();
    } else if (actionType === "delete") {
      handleDeletePost();
    }
    setShowCheckSecret(false); // Close the dialog
  };

  const handleUpvote = async () => {
    if (hasUpvoted) {
      // Possibly show a message that the user has already upvoted
      console.log("You have already upvoted this post.");
      return;
    }

    if (!user || !user.username) {
      alert("Please log in to upvote.");
      return;
    }

    try {
      const { data, error } = await supabase.rpc("update_upvotes", {
        post_id: post.id,
        upvoter_username: user.username,
      });

      if (error) {
        console.error("Error updating upvotes:", error);
      } else {
        // Update local posts state optimistically with the returned updated upvotes
        setPost({ ...post, upvotes: data });
      }
    } catch (error) {
      console.error("Error calling stored procedure:", error);
    }
  };



  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user || !user.username) {
      alert("Please log in to leave a comment.");
      return;
    }

    try {
      const { data, error } = await supabase.rpc("add_comment", {
        post_id: id,
        commenter_username: user.username,
        comment_text: comment,
      });

      if (error) {
        console.error("Error adding comment:", error);
      } else {
        if (post.comments === null) {
          setPost({
            ...post,
            comments: [data], // Start the comments array with the new comment
          });
        } else {
          setPost({
            ...post,
            comments: [...post.comments, data], // Append the new comment to the existing array
          });
        }
        setComment(""); // Clear the comment input
      }
    } catch (error) {
      console.error("Error calling add_comment function:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id, showCheckSecret]);

  const fetchPost = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching post:", error);
      setLoading(false);
    } else {
      setPost(data);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }


  // Format the post date
  const postedAt = new Date(post.created_at).toLocaleString();

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4">
        <Button onClick={() => navigate("/")} className="mb-4">
          Back
        </Button>

          <CheckSecret
            post={post}
            action={handlePostAction}
            isOpen={showCheckSecret}
            onClose={() => setShowCheckSecret(false)}
          />

        <h1 className="text-3xl font-bold text-gray-800 mb-6">{post.title}</h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 inline-flex w-full">
            <h3 className="w-1/2 text-lg leading-6 font-medium text-gray-900">
              Posted {postedAt}
            </h3>
            <div className="w-1/2 grid grid-flow-row grid-cols-4 align-items-center justify-content-end space-x-1.5">
              <Button
                className="col-end-4"
                onClick={() => { setActionType('edit'); setShowCheckSecret(true); }}
              >
                Edit Post ✏️
              </Button>
              <Button className="" onClick={() => { setActionType('delete'); setShowCheckSecret(true); }}>
                Delete Post 🗑️
              </Button>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Content</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {post.content}
                </dd>
              </div>
              {post.imageURL && (
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Image</dt>
                  <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                    <img
                      src={post.imageURL}
                      alt="Post"
                      className="w-96 rounded-lg"
                    />
                  </dd>
                </div>
              )}
                {post.videoURL && (
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Video</dt>
                        <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                            <ReactPlayer url={post.videoURL} controls={true} />
                        </dd>
                    </div>
                )}
              {/* You would also render comments here */}
            </dl>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
              hasUpvoted
                ? "text-gray-500 bg-gray-200"
                : "text-white bg-green-600 hover:bg-green-700"
            }`}
            onClick={handleUpvote}
            disabled={hasUpvoted}
          >
            <ArrowUp className="mr-2" />
            {post.upvotes?.length || 0} upvotes
          </Button>
          <form onSubmit={handleAddComment} className="flex w-full">
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md mr-2"
              placeholder="Leave a comment..."
            />
            <Button onClick={handleAddComment}>
              <SendHorizontal />
            </Button>
          </form>
        </div>
        {/* Comments section */}
        <div className="mt-4">
          <p className="font-medium">Comments:</p>
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((c, index) => (
              <div key={index} className="mt-2">
                <p className="text-sm font-semibold">{c.username}</p>
                <p className="text-sm">{c.content}</p>
                <p className="text-sm text-gray-500">
                  {new Date(c.created_at).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 mt-4">No comments yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}

export default PostPage;
