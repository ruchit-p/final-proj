import React, { useState, useEffect } from "react";
import Post from "../components/Post";
import supabase from "../../client";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Settings2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

function Home() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [orderBy, setOrderBy] = useState("newest"); // Track sorting order
  const [showImages, setShowImages] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showVideos, setShowVideos] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    setCurrentUser(user);
    const searchTerm = searchParams.get("search");
    if (searchTerm) {
      fetchSearchResults(searchTerm);
    } else {
      fetchPosts();
    }
  }, [searchParams, orderBy]); // React to changes in searchParams

  const fetchSearchResults = async (searchTerm) => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .ilike("title", `%${searchTerm}%`) // Search for posts with a title similar to searchTerm
      .order(orderBy === "newest" ? "created_at" : "upvotes", {
        ascending: false,
      });

    if (error) {
      console.error("Error searching posts:", error);
    } else {
      setPosts(data);
    }
  };

  const fetchPosts = async () => {
    let query = supabase.from("posts").select("*");

    // Apply sorting based on orderBy state
    if (orderBy === "newest") {
      query = query.order("created_at", { ascending: false });
    } else if (orderBy === "popular") {
      query = query.order("upvotes", { ascending: false }); // Assuming 'upvotes' column is the number of likes
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching posts:", error);
    } else {
      setPosts(data);
    }
  };

  const handleUpvote = async (postId) => {
    setCurrentUser(user);
    console.log(currentUser);
    // Ensure user is logged in
    if (!currentUser || !currentUser.username) {
      alert("Please try to upvote again.");
      return;
    }

    try {
      // Call the stored procedure with parameters
      const { data, error } = await supabase.rpc("update_upvotes", {
        post_id: postId,
        upvoter_username: currentUser.username,
      });

      if (error) {
        console.error("Error updating upvotes:", error);
      } else {
        // Update local posts state optimistically with the returned updated upvotes
        setPosts(
          posts.map((post) =>
            post.id === postId ? { ...post, upvotes: data } : post
          )
        );
      }
    } catch (error) {
      console.error("Error calling stored procedure:", error);
    }
  };

  return (
    <main className="bg-white">
      <div className="container mx-auto p-4">
        <div className="text-center mb-4">
          <div className="flex justify-start items-center text-center space-x-4 my-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <Settings2 />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Edit profile</SheetTitle>
                  <SheetDescription>
                    Make changes to your profile here. Click save when you're
                    done.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="setImages" className="text-right">
                      Show Images
                    </Label>
                    <Switch id="setImages" checked={showImages} onCheckedChange={() => setShowImages(!showImages)}></Switch>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="setVideos" className="text-right">
                      Show Videos
                    </Label>
                    <Switch id="setVideos" checked={showVideos} onCheckedChange={() => setShowVideos(!showVideos)}></Switch>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="setContent" className="text-right">
                      Show Content
                    </Label>
                    <Switch id="setContent" checked={showContent} onCheckedChange={() => setShowContent(!showContent)}></Switch>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <h1 className="">Order by:</h1>
            <Button
              className={`px-4 py-2 rounded-lg ${
                orderBy === "newest"
                  ? "bg-blue-500 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-500 hover:bg-gray-500 hover:text-white"
              }`}
              onClick={() => setOrderBy("newest")}
            >
              Newest
            </Button>
            <Button
              className={`px-4 py-2 rounded-lg ${
                orderBy === "popular"
                  ? "bg-blue-500 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-500 hover:bg-gray-300 "
              }`}
              onClick={() => setOrderBy("popular")}
            >
              Most Popular
            </Button>
          </div>
        </div>

        <div>
          {posts.map((post) => (
            <Post
              key={post.id}
              id={post.id}
              username={post.username}
              title={post.title}
              content={post.content}
              imageURL={post.imageURL}
              upvotes={post.upvotes || []}
              postedAt={new Date(post.created_at).toLocaleString()}
              onUpvote={() => handleUpvote(post.id)} // Pass only postId
              // Add Tailwind CSS classes here to style the Post component
              className="bg-gray-100 p-6 rounded-lg shadow-md mb-4"
              showImages={showImages}
              showContent={showContent}
              showVideos={showVideos}
              videoURL={post.videoURL}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default Home;
