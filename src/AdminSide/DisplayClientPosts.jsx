import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminNav from './adminNav';
import ConfirmationModal from './ConfirmationModal'; // Import the modal
import UpdatePostModal from './UpdatePostModal'; // Import the update modal

const DisplayClientPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [postToUpdate, setPostToUpdate] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [filteredPosts, setFilteredPosts] = useState([]); // State for filtered posts
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const postsPerPage = 4; // Number of posts per page

  // Fetch all posts when the component loads
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get('https://rentoora-backend-rental.onrender.com/admin/posts', config);
        setPosts(response.data);
        setFilteredPosts(response.data); // Initialize filtered posts
      } catch (error) {
        console.error('Error fetching posts:', error);
        if (error.response && error.response.status === 401) {
          toast.error('Unauthorized: Please log in as an admin');
        } else {
          toast.error('Error fetching posts');
        }
      }
    };

    fetchPosts();
  }, []);

  // Update filtered posts whenever the search term or posts change
  useEffect(() => {
    const filtered = posts.filter(post =>
      post.clientId?.accountId.toString().includes(searchTerm)
    );
    setFilteredPosts(filtered);
  }, [searchTerm, posts]);

  // Handle post deletion
  const handleDeletePost = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`https://rentoora-backend-rental.onrender.com/admin/posts/${postIdToDelete}`, config);
      setPosts(posts.filter(post => post._id !== postIdToDelete));
      setFilteredPosts(filteredPosts.filter(post => post._id !== postIdToDelete)); // Update filtered posts
      toast.success('Post deleted successfully');
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Error deleting post');
    }
  };

  // Handle post update
  const handleUpdatePost = async (updatedPost) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(`https://rentoora-backend-rental.onrender.com/admin/posts/${updatedPost._id}`, {
        postType: updatedPost.postType,
        description: updatedPost.description,
        price: updatedPost.price,
      }, config);

      // Update the posts in state
      setPosts(posts.map(post => (post._id === updatedPost._id ? updatedPost : post)));
      setFilteredPosts(filteredPosts.map(post => (post._id === updatedPost._id ? updatedPost : post))); // Update filtered posts
      toast.success('Post updated successfully');
      setIsUpdateModalOpen(false);
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Error updating post');
    }
  };

  // Handle update post button click
  const handleOpenUpdateModal = (post) => {
    setPostToUpdate(post);
    setIsUpdateModalOpen(true);
  };

  // Calculate current posts for the current page
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Calculate total pages
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container mx-auto bg-white h-screen">
       <div className="lg:mx-8 lg:pt-8">
      <AdminNav />
      </div>
      <div className="flex justify-between items-center w-[95%] mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Manage Client Posts</h1>
      
      {/* Search Box */}
      <div className="mb-4 flex justify-end items-center">
        <div className="bg-blue-700 rounded">
          <i className="fa-solid fa-magnifying-glass px-3 text-white"></i>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-2 outline-none p-2 w-[250px] focus:border-blue-700 "
            placeholder="Search by Account ID"
          />
        </div>
      </div>
      </div>

      {currentPosts.length > 0 ? (
        <table className="w-[95%] mx-auto bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4 border-b">#</th>
              <th className="py-2 px-4 border-b">Image</th>
              <th className="py-2 px-4 border-b">Post Type</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Posted Date</th>
              <th className="py-2 px-4 border-b">Post By</th>
              <th className="py-2 px-4 border-b">Account ID</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map((post, index) => (
              <tr key={post._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{index + 1 + indexOfFirstPost}</td>
                <td className="py-2 px-4 border-b">
                  {Array.isArray(post.images) && post.images.length > 0 ? (
                    <img
                      src={`https://rentoora-backend-rental.onrender.com/${post.images[0]}`}
                      alt={post.postType}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ) : (
                    <p className="text-gray-500 text-center">No image available</p>
                  )}
                </td>
                <td className="py-2 px-4 border-b">{post.postType}</td>
                <td className="py-2 px-4 border-b">{post.description}</td>
                <td className="py-2 px-4 border-b">Rs. {post.price}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">{post.clientId?.name || 'N/A'}</td>
                <td className="py-2 px-4 border-b">{post.clientId?.accountId || 'N/A'}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleOpenUpdateModal(post)} // Open update modal
                    className="mr-2  "
                  >
                    <i class="fa-solid fa-pen-to-square text-blue-700 rounded"></i>
                  </button>
                  <button
                    onClick={() => {
                      setPostIdToDelete(post._id);
                      setIsDeleteModalOpen(true);
                    }}
                    className=" "
                  >
                    <i class="fa-solid fa-trash text-red-600"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500">No posts available.</p>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4 w-[95%] mx-auto">
        <button 
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 bg-gray-300 text-black rounded ${currentPage === 1 ? 'cursor-not-allowed' : 'hover:bg-gray-400'}`}
        >
          Previous
        </button>
        <span className="self-center">{`Page ${currentPage} of ${totalPages}`}</span>
        <button 
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 bg-gray-300 text-black rounded ${currentPage === totalPages ? 'cursor-not-allowed' : 'hover:bg-gray-400'}`}
        >
          Next
        </button>
      </div>

      {/* Confirmation Modal for Deleting Posts */}
      <ConfirmationModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleDeletePost} 
      />

      {/* Update Post Modal */}
      <UpdatePostModal 
        isOpen={isUpdateModalOpen} 
        onClose={() => setIsUpdateModalOpen(false)} 
        post={postToUpdate} 
        onUpdate={handleUpdatePost} 
      />
    </div>
  );
};

export default DisplayClientPosts;
