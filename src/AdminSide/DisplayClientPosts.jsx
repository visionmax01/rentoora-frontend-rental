import React, { useEffect, useState } from 'react';
import Api from '../utils/Api.js'
import {toast} from 'react-toastify';
import AdminNav from './adminNav';
import ConfirmationModal from './ConfirmationModal'; 
import UpdatePostModal from './UpdatePostModal'; 
import PostDetailsModal from '../utils/AdminViewPostPopup'; 


const DisplayClientPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [postToUpdate, setPostToUpdate] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [postDetails, setPostDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isdeleting, setIsDeleting] = useState(false);
  const [isupdating, setUpdating] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await Api.get('admin/posts', config);
        setPosts(response.data);
        setFilteredPosts(response.data);
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

  useEffect(() => {
    const filtered = posts.filter(post =>
      post.clientId?.accountId.toString().includes(searchTerm)
    );
    setFilteredPosts(filtered);
  }, [searchTerm, posts]);



const handleDeletePost = async () => {
  setIsDeleting(true); // Set loading state to true when delete action is confirmed
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await Api.delete(`admin/posts/${postIdToDelete}`, config);
    setPosts(posts.filter(post => post._id !== postIdToDelete));
    setFilteredPosts(filteredPosts.filter(post => post._id !== postIdToDelete));
    toast.success('Post deleted successfully');
    setIsDeleteModalOpen(false);
  } catch (error) {
    console.error('Error deleting post:', error);
    toast.error('Error deleting post');
  } finally {
    setIsDeleting(false); // Reset loading state after delete action completes
  }
};

// Pass isdeleting prop correctly to ConfirmationModal
{isDeleteModalOpen && (
  <ConfirmationModal
    isOpen={isDeleteModalOpen}
    onClose={() => setIsDeleteModalOpen(false)}
    onConfirm={handleDeletePost}
    isdeleting={isdeleting} // Pass the state directly
  />
)}


  const handleUpdatePost = async (updatedPost) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await Api.put(`admin/posts/${updatedPost._id}`, {
        postType: updatedPost.postType,
        description: updatedPost.description,
        price: updatedPost.price,
      }, config);

      setPosts(posts.map(post => (post._id === updatedPost._id ? updatedPost : post)));
      setFilteredPosts(filteredPosts.map(post => (post._id === updatedPost._id ? updatedPost : post)));
      toast.success('Post updated successfully');
      setIsUpdateModalOpen(false);
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Unable to Update the post is Booked');
    }finally{
      setUpdating(false);
    }
  };

  const handleOpenUpdateModal = (post) => {
    setPostToUpdate(post);
    setIsUpdateModalOpen(true);
  };

  const handleViewPostDetails = (post) => {
    setPostDetails(post);
    setIsDetailsModalOpen(true);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

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
    <div className="container mx-auto bg-white min-h-screen lg:p-8 pb-8">
      <AdminNav />
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 mt-6 lg:mt-0">
        <h1 className="lg:text-2xl font-bold text-center lg:mb-0 mb-4 text-lg">Manage Client Posts</h1>
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute top-3.5 left-2 text-gray-400"></i>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-2 border-gray-300 outline-none p-2 pl-10 w-full md:w-64 rounded"
            placeholder="Search by Account ID"
          />
        </div>
      </div>

      {/* Desktop View */}
      {currentPosts.length > 0 ? (
        <table className="w-full hidden lg:table bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4 border-b">#</th>
              <th className="py-2 px-4 border-b">Image</th>
              <th className="py-2 px-4 border-b">Satatus</th>
              <th className="py-2 px-4 border-b">Post Type</th>
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
                      src={post.images[0]} 
                      alt={post.postType}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ) : (
                    <p className="text-gray-500 text-center">No image available</p>
                  )}
                </td>
                <td className="py-2 px-4 border-b">{post.status}</td>
                <td className="py-2 px-4 border-b">{post.postType}</td>
                <td className="py-2 px-4 border-b">Rs. {post.price}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b ">{post.clientId?.name || 'N/A'}</td>
                <td className="py-2 px-4 border-b ">{post.clientId?.accountId || 'N/A'}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleOpenUpdateModal(post)} 
                    className="text-blue-700 hover:bg-brand-Black hover:bg-opacity-25 rounded-md bg-brand-white px-2 py-1"
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    onClick={() => {
                      setPostIdToDelete(post._id);
                      setIsDeleteModalOpen(true);
                    }}
                    className="text-red-600  hover:bg-brand-Black hover:bg-opacity-25 rounded-md bg-brand-white px-2 py-1"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <button
                    onClick={() => handleViewPostDetails(post)}
                    className="text-green-600 hover:bg-brand-Black hover:bg-opacity-25 rounded-md bg-brand-white px-2 py-1"
                  >
                    <i className="fa-solid fa-eye"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500">No posts available</p>
      )}

      {/* Mobile View */}
      {currentPosts.length > 0 ? (
        <div className="block lg:hidden">
          {currentPosts.map((post, index) => (
            <div key={post._id} className="border border-gray-300 rounded-lg mx-4 p-4 mb-4">
              <div className="flex justify-between items-center">
                <h2 className="font-bold"># {index + 1 + indexOfFirstPost}.&nbsp;{post.postType}</h2>
                <div>
                  <button
                    onClick={() => handleOpenUpdateModal(post)} 
                    className="text-blue-700 hover:bg-brand-Black hover:bg-opacity-25 rounded-md bg-brand-white px-2 py-1"
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    onClick={() => {
                      setPostIdToDelete(post._id);
                      setIsDeleteModalOpen(true);
                    }}
                    className="text-red-600 mx-4 hover:bg-brand-Black hover:bg-opacity-25 rounded-md bg-brand-white px-2 py-1"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <button
                    onClick={() => handleViewPostDetails(post)}
                    className="text-green-600 hover:bg-brand-Black hover:bg-opacity-25 rounded-md bg-brand-white px-2 py-1"
                  >
                    <i className="fa-solid fa-eye"></i>
                  </button>
                </div>
              </div>
              <p className="">Price: <strong className='text-gray-500'>Rs. {post.price}</strong></p>
              <p className="">Posted on: <strong className='text-gray-500'>{new Date(post.createdAt).toLocaleDateString()}</strong></p>
              <p className="">Posted by: <strong className='text-gray-500'>{post.clientId?.name || 'N/A'}</strong></p>
              <p className="">Account ID: <strong className='text-gray-500'>{post.clientId?.accountId || 'N/A'}</strong></p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500"></p>
      )}

      <div className="flex justify-center items-center lg:gap-8 gap-4 mt-4  lg:mx-0">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded bg-blue-500 text-white ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded bg-blue-500 text-white ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Next
        </button>
      </div>

      {isDeleteModalOpen && (
  <ConfirmationModal
    isOpen={isDeleteModalOpen}
    onClose={() => setIsDeleteModalOpen(false)}
    onConfirm={handleDeletePost}
    isdeleting={isdeleting} // Pass the state directly
  />
)}
      {isUpdateModalOpen && (
        <UpdatePostModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          post={postToUpdate}
          onUpdate={handleUpdatePost}
          isupdating={isupdating}
        />
      )}
      {isDetailsModalOpen && (
        <PostDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          post={postDetails}
        />
      )}
    </div>
  );
};

export default DisplayClientPosts;
