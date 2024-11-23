import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Api from "../../utils/Api.js";
import Skeleton from "react-loading-skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faRotate,
  faSearch,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import NavBar from "../NavBar.jsx";
import { motion } from "framer-motion";

const SearchResult = () => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [selectedPostType, setSelectedPostType] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);
  const [searchContainerOpen, setSearchContainerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const term = searchParams.get("searchTerm");
    if (term) {
      setSearchTerm(term);
      fetchResults(term, propertyType);
    }
  }, [location.search, propertyType]);

  useEffect(() => {
    filterResults();
  }, [selectedPostType, results]);

  const filterResults = () => {
    if (!selectedPostType) {
      setFilteredResults(results);
    } else {
      const filtered = results.filter(
        (post) => post.postType.toLowerCase() === selectedPostType.toLowerCase()
      );
      setFilteredResults(filtered);
    }
  };

  const fetchResults = async (term, type) => {
    setLoading(true);
    setResults([]);
    try {
      const response = await Api.get(
        `rentals/search?searchTerm=${encodeURIComponent(
          term
        )}&propertyType=${encodeURIComponent(type)}`
      );
      const fetchedResults = response.data || [];
      const availableResults = fetchedResults.filter(
        (post) => post.status !== "Booked"
      );
      setResults(Array.isArray(availableResults) ? availableResults : []);
      setFilteredResults(
        Array.isArray(availableResults) ? availableResults : []
      );
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResults(searchTerm, propertyType);
  };

  const handleViewPost = (postId) => {
    navigate(`/rental/${postId}`);
  };

  const getUniquePostTypes = () => {
    const types = [...new Set(results.map((post) => post.postType))];
    return types;
  };

  const handleViewMore = () => {
    setVisibleCount((prevCount) => prevCount + 5);
  };

  const hasMorePosts = visibleCount < filteredResults.length;

  const toggleSearchContainer = () => {
    setSearchContainerOpen(!searchContainerOpen);
  };

  if (loading)
    return (
      <div className="h-screen w-full flex bg-gradient-to-r from-blue-500/25 via-indigo-500/25 to-purple-600/25 items-center justify-center">
        <div className="shadow-2xl text-xl gap-6 bg-white flex flex-col items-center justify-center rounded-lg p-8">
          <p className="text-4xl text-blue-600">
            <FontAwesomeIcon icon={faRotate} className={`animate-spin`} />
          </p>
          <p className="text-gray-700 font-semibold">Searching, please wait...</p>
        </div>
      </div>
    );

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
            <div className="flex flex-wrap items-center lg:gap-8  pt-12 lg:pt-0">
              <form onSubmit={handleSearch} className="flex w-full lg:w-1/4 gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded transition-colors duration-300"
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </form>
              <div className="w-full lg:w-fit mt-4 md:mt-0">
                <select
                  value={selectedPostType}
                  onChange={(e) => setSelectedPostType(e.target.value)}
                  className="border border-gray-300 rounded py-2 px-4  w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">All Post Types</option>
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
        onClick={toggleSearchContainer}
        className="fixed top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white h-8 w-8 rounded shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110"
      >
        <FontAwesomeIcon className="text-sm" icon={searchContainerOpen ? faXmark : faSearch} />
      </button>

      <div className="mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center relative">
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 mt-8 w-full"
            initial={{ y: '10px', opacity: 0 }}  
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.5, delay: 0.2 }} 
          >
            {filteredResults.length === 0 ? (
              <p className="text-center col-span-full text-gray-600 text-lg">No results found.</p>
            ) : (
              filteredResults.slice(0, visibleCount).map((post) => (
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
                          {post.address.province}
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
              ))
            )}
          </motion.div>

          {hasMorePosts && (
            <button
              className="mt-6 sm:mt-8 bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 text-sm sm:text-base"
              onClick={handleViewMore}
            >
              View More
            </button>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default SearchResult;
