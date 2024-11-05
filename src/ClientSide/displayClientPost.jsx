import React, { useEffect, useState } from "react";
import Api from '../utils/Api.js'
import {toast} from "react-toastify";
import { FaSpinner } from "react-icons/fa";

const DisplayPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const [error, setError] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const token = localStorage.getItem("token");

  const fetchPosts = async () => {
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await Api.get("api/post", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : "Error fetching posts"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const response = await Api.delete(
        `api/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { message } = response.data;
      toast.success(message);
      setPosts(posts.filter((post) => post._id !== postId));
      setShowDeletePopup(false); // Hide popup after delete
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error deleting post";
      toast.error(errorMessage);
    }
  };

  const handleUpdate = async () => {
    if (selectedPost.status === "Booked") {
      toast.error(
        "You can't update or modify a booked status. Please cancel the order first."
      );
      return;
    }
    try {
      setLoadingUpdate(true);
      const response = await Api.put(
        `api/posts/${selectedPost._id}`,
        selectedPost,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Post updated successfully!");
      setShowUpdatePopup(false); // Close the update form after saving
      fetchPosts(); // Reload the posts to reflect the update
    } catch (error) {
      toast.error("Error updating post");
    } finally {
      setLoadingUpdate(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-CA", options);
  };

  const formatDescription = (description) => {
    const chunks = description
      .split(",")
      .map((chunk, index) => `${index + 1}. ${chunk.trim()}`);
    return chunks.join("\n");
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (posts.length === 0)
    return <p className="p-4 bg-brand-bgColor ">No posts available.</p>;

  return (
    <div className=" py-4 ">
      <div className="p-4 lg:ml-12 h-fit  ">
        <h1 className="text-2xl font-bold mb-6 text-left text-brand-Black">
          Your Posts
        </h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {posts.map((post) => (
            <div
              key={post._id}
              className="rounded-lg flex flex-col justify-between h-auto bg-brand-Black shadow-lg transform transition duration-300 hover:scale-110"
            >
              {post.images.length > 0 ? (
                <img
                  src={post.images[0]}
                  alt="Post image"
                  className="w-full relative h-36 object-fit object-center rounded-t-md "
                />
              ) : (
                <p className="text-gray-500 text-center h-36 flex items-center justify-center bg-brand-bgColor rounded-t-lg">
                  No image available
                </p>
              )}
              <h2 className="text-xl font-semibold uppercase text-center bg-brand-lightdark">
                {post.postType}
              </h2>
              <div className="px-3 py-1">
                <p className="mt-2 mb-1">
                  {(() => {
                    const chunks = post.description
                      .split(",")
                      .map((chunk) => chunk.trim());
                    const limitedChunks = chunks.slice(0, 4); // Limit to 4 items
                    const formattedChunks = limitedChunks.map(
                      (chunk, index) => (
                        <span key={index}>
                          {index + 1}. {chunk}
                          <br /> {/* Break line after each item */}
                        </span>
                      )
                    );
                    return (
                      <>
                        {formattedChunks}
                        {chunks.length > 4 && <span>...</span>}{" "}
                        {/* Append '...' if more than 4 items */}
                      </>
                    );
                  })()}
                </p>

                <p
                  className={`absolute rounded-tl-lg top-0 left-0 p-2 text-white ${
                    post.status === "Booked" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {post.status}
                </p>

                <p className="font-bold -mb-5">
                  Price:{" "}
                  <span className="text-3xl text-secondary-green">
                    {" "}
                    Rs.{post.price.toLocaleString()}
                  </span>
                </p>

                <p className="absolute bottom-2 text-sm text-gray-100">
                  Posted on: &nbsp;{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(post.createdAt))}
                </p>
              </div>
              <div className="mx-3 py-2 flex justify-end mb-2 items-end ">
                <button
                  onClick={() => {
                    setSelectedPost(post);
                    setShowUpdatePopup(true); // Show update form popup
                  }}
                  className="bg-gray-500 text-white px-2 py-1 rounded-full"
                >
                  <i className="fa-regular fa-pen-to-square"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Update post popup */}
        {showUpdatePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            
          <div className="relative lg:w-1/2 w-[95%]  lg:flex lg:gap-8 lg:bg-brand-bgColor lg:p-4 rounded-lg ">
                <button
                    onClick={() => setShowUpdatePopup(false)}
                    type="button"
                    className="absolute hidden sm:block top-0 right-0 bg-brand-bgColor rounded-tr-lg text-white hover:text-red-400 px-3 py-1 rounded-sm"
                  >
                    X
                  </button>
            <div className="bg-brand-white h-[650px] lg:h-auto overflow-y-auto lg:bg-brand-bgColor lg:text-brand-white lg:w-3/4 w-full text-black p-6 rounded-lg relative">
              <h3 className="text-xl font-bold mb-2 uppercase text-center">
                Update Post
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Type</label>
                  <input
                    type="text"
                    value={selectedPost.postType}
                    disabled
                    onChange={(e) =>
                      setSelectedPost({
                        ...selectedPost,
                        postType: e.target.value,
                      })
                    }
                    className="w-full text-blue-600 bg-transparent outline-none focus:border-red-400 border px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Description</label>
                  <textarea
                    value={selectedPost.description}
                    onChange={(e) =>
                      setSelectedPost({
                        ...selectedPost,
                        description: e.target.value,
                      })
                    }
                    className="w-full text-blue-600 h-32 bg-transparent outline-none focus:border-red-400 border px-2 py-1"
                  />
                  <div className="mt-2 h-[200px] overflow-y-auto  block sm:hidden">
                    <h3 className="font-bold mb-1">Formatted Description:</h3>
                    <pre className="h-[200px] overflow-y-auto whitespace-pre-wrap text-blue-600">
                      {formatDescription(selectedPost.description)}
                    </pre>
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1">Price</label>
                  <input
                    type="number"
                    value={selectedPost.price}
                    onChange={(e) =>
                      setSelectedPost({
                        ...selectedPost,
                        price: e.target.value,
                      })
                    }
                    className="w-full text-blue-600 bg-transparent outline-none focus:border-red-400 border px-2 py-1"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={handleUpdate}
                    type="button"
                    className="bg-blue-500 flex justify-center items-center hover:bg-blue-700 text-white px-4 py-2 rounded-sm"
                  >
                    {loadingUpdate ? (
                      <>
                        <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                        Updating...
                      </>
                    ) : (
                      "Update"
                    )}
                  </button>
                  <button
                    onClick={() => setShowUpdatePopup(false)}
                    type="button"
                    className="absolute block sm:hidden top-0 right-0 bg-brand-bgColor rounded-tr-lg text-white hover:text-red-400 px-3 py-1 rounded-sm"
                  >
                    X
                  </button>
                </div>
              </form>
            </div>
                   {/* discription preview  */}
                    <div className=" w-1/2 rounded-lg hidden bg-brand-bgColor sm:block ">
                    <h3 className="font-bold mb-1">Formatted Description:</h3>
                    <pre className="overflow-y-auto  overflow-hidden h-[350px] whitespace-pre-wrap text-blue-600">
                      {formatDescription(selectedPost.description)}
                    </pre>
            </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayPosts;
