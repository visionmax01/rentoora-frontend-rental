import React, { useEffect, useState } from "react";
import Api from "../utils/Api.js";
import { toast } from "react-toastify";
import { FaSpinner, FaEdit, FaTrash } from "react-icons/fa";

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
    const postToDelete = posts.find(post => post._id === postId);
    if (postToDelete.status === "Booked") {
      toast.error("Can't delete a booked post");
      return;
    }
    setSelectedPost(postToDelete);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await Api.delete(`api/posts/${selectedPost._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { message } = response.data;
      toast.success(message);
      setPosts(posts.filter((post) => post._id !== selectedPost._id));
      setShowDeletePopup(false);
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
      setShowUpdatePopup(false);
      fetchPosts();
    } catch (error) {
      toast.error("Error updating post");
    } finally {
      setLoadingUpdate(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <p className="text-center text-gray-600 mt-8">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;
  if (posts.length === 0)
    return <p className="text-center text-gray-600 mt-8">No posts available.</p>;

  return (
    <div className="bg-gradient-to-l from-blue-100 to-purple-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Your Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2"
            >
              <div className="relative">
                {post.images.length > 0 ? (
                  <div className="relative h-40">
                     <img
                    src={post.images[0]}
                    alt="Post image"
                    className="w-full h-full object-cover"
                  />
                      <div className="flex absolute bottom-3 right-4 gap-3 justify-between items-center">
                  <button
                    onClick={() => {
                      setSelectedPost(post);
                      setShowUpdatePopup(true);
                    }}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition duration-300 flex items-center"
                  >
                    <FaEdit  /> 
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300 flex items-center"
                  >
                    <FaTrash  /> 
                  </button>
                </div>
                  </div>
                 
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">No image available</p>
                  </div>
                )}
                <div className="absolute top-0 right-0 bg-gray-300 bg-opacity-90 px-3 py-1 m-2 rounded">
                  <p className={`font-semibold ${post.status === "Booked" ? "text-green-600" : "text-red-600"}`}>
                    {post.status}
                  </p>
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2 text-gray-800">{post.postType}</h2>
                <p className="text-gray-600 mb-2 truncate">
                  {post.description}
                </p>
                <p className="text-2xl font-bold text-indigo-600 mb-2">
                  Rs. {post.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Posted on: {formatDate(post.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {showUpdatePopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
              <h3 className="text-3xl font-bold mb-6 text-gray-800">Update Post</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <input
                    type="text"
                    value={selectedPost.postType}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={selectedPost.description}
                    onChange={(e) =>
                      setSelectedPost({
                        ...selectedPost,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 h-40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    value={selectedPost.price}
                    onChange={(e) =>
                      setSelectedPost({
                        ...selectedPost,
                        price: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowUpdatePopup(false)}
                    type="button"
                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    type="button"
                    className="px-6 py-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-300 flex items-center"
                  >
                    {loadingUpdate ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      "Update"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDeletePopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Confirm Delete</h3>
              <p className="mb-6 text-gray-600">Are you sure you want to delete this post?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeletePopup(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayPosts;
