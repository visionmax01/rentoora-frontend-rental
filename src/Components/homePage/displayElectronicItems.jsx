import React, { useEffect, useState, useRef } from "react";
import Api from "../../utils/Api.js";
import {toast} from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import NavBar from "../../Components/NavBar.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
import Fuse from "fuse.js";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'; 
import { motion } from "framer-motion";

const DisplayElectronicItems = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const defaultPostsToShow = 8;
  const [searchContainerOpen, setSearchContainerOpen] = useState(false);
  const [selectedPostType, setSelectedPostType] = useState("");
  const excludedServiceTypes = ["Room", "Apartment", "House"];

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await Api.get("order/display-posts");
        // Filter out posts with status "Booked"
        const availablePosts = response.data.filter(post => post.status !== "Booked");
        setPosts(availablePosts);
      } catch (error) {
        setError("Error fetching posts");
        toast.error("Error fetching posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term.");
      return;
    }

    setSearchAttempted(true);
    setIsSearching(true);

    const addressComponents = searchTerm
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    try {
      const response = await Api.get("rentals/search", {
        params: { searchTerm: addressComponents },
      });

      const fuse = new Fuse(response.data, {
        keys: [
          { name: "address.province", weight: 1 },
          { name: "address.district", weight: 1 },
          { name: "address.municipality", weight: 1 },
          { name: "address.landmark", weight: 1 },
          { name: "description", weight: 0.5 },
        ],
        includeScore: true,
      });

      const results = fuse.search(searchTerm);
      // Filter out "Booked" posts from search results
      const availableResults = results
        .map((result) => result.item)
        .filter(item => item.status !== "Booked");
      setSearchResults(availableResults);
    } catch (error) {
      setError("Error fetching search results");
      toast.error("Error fetching search results");
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleViewPost = (postId) => {
    navigate(`/rental/${postId}`);
  };

  const getFilteredPosts = () => {
    let filteredPosts = searchAttempted ? searchResults : posts;
    
    if (selectedPostType) {
      filteredPosts = filteredPosts.filter(
        post => post.postType === selectedPostType
      );
    }

    filteredPosts = filteredPosts.filter(
      post => !excludedServiceTypes.includes(post.postType) && post.status !== "Booked"
    );

    return filteredPosts.slice(0, defaultPostsToShow);
  };

  const getUniquePostTypes = () => {
    const types = [...new Set(posts.map((post) => post.postType))];
    return types.filter(type => !excludedServiceTypes.includes(type));
  };

  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <>
      <div className="min-h-screen relative bg-gradient-to-b from-blue-100 to-purple-100">
        <NavBar />
        
        <div className={`fixed top-0 left-0 z-50 w-full ${searchContainerOpen ? '' : 'pointer-events-none'}`}>
          <motion.div
            initial={{ y: -200, opacity: 0 }}
            animate={{ y: searchContainerOpen ? 0 : -200, opacity: searchContainerOpen ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-gradient-to-l from-blue-100 to-purple-100 shadow-md pointer-events-auto"
          >
            <div className="container mx-auto px-4 py-3">
              <div className="flex flex-wrap items-center lg:gap-8 pt-12 lg:pt-0">
                <div className="flex w-full lg:w-1/4 gap-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    ref={searchInputRef}
                    placeholder="Search by type, location, etc."
                    className="border border-gray-300 rounded py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded transition-colors duration-300"
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </button>
                </div>

                <div className="w-full lg:w-fit mt-4 lg:mt-0">
                  <select
                    value={selectedPostType}
                    onChange={(e) => setSelectedPostType(e.target.value)}
                    className="border border-gray-300 rounded py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">All Service Types</option>
                    {getUniquePostTypes().map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <button
          onClick={() => setSearchContainerOpen(!searchContainerOpen)}
          className="fixed top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white h-8 w-8 rounded shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110"
        >
          <FontAwesomeIcon className="text-sm" icon={searchContainerOpen ? faXmark : faSearch} />
        </button>

        <div className="mx-auto px-4 py-8">
          {isSearching && (
            <div className="flex items-center justify-center mt-10">
              <FaSpinner className="animate-spin h-10 w-10" />
            </div>
          )}

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8"
            initial={{ y: '10px', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {getFilteredPosts().map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white h-fit rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="relative">
                  {loading ? (
                    <Skeleton height={200} />
                  ) : Array.isArray(post.images) && post.images.length > 0 ? (
                    <div className="relative h-36 sm:h-48">
                      <img
                        src={post.images[0]}
                        alt={post.postType}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                      <h2 className="absolute bottom-0 left-0 w-full text-sm sm:text-xl font-bold text-white p-2 sm:p-4">
                        {post.postType}
                      </h2>
                    </div>
                  ) : (
                    <div className="h-36 sm:h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                      No image available
                    </div>
                  )}
                  <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 m-1 sm:m-2 rounded text-xs sm:text-sm font-bold">
                    Rs. {Number(post.price).toLocaleString("en-IN")}
                  </div>
                </div>

                <div className="p-2 sm:p-4">
                  <p className="text-gray-600 mb-2 text-xs sm:text-sm line-clamp-1">{post.description}</p>
                  {post.address && (
                    <div className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faLocationDot} className="mr-1 sm:mr-2 text-blue-500" />
                      <p className="truncate">
                      {post.address.district}
                      </p>
                    </div>
                    <p className="truncate">City: {post.address.landmark}</p>
                  </div>
                  )}
                  <button
                    className="mt-2 sm:mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 sm:py-2 px-2 sm:px-4 rounded-full text-xs sm:text-sm transition-colors duration-300"
                    onClick={() => handleViewPost(post._id)}
                  >
                    BOOK NOW
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {getFilteredPosts().length === 0 && (
            <div className="text-center mt-8 text-gray-600">
              No items found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DisplayElectronicItems;
