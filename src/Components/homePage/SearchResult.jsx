import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Api from '../../utils/Api.js';
import Skeleton from 'react-loading-skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faRotate } from '@fortawesome/free-solid-svg-icons';
import NavBar from '../NavBar.jsx';
import { motion } from 'framer-motion'; // Import motion from framer-motion

const SearchResult = () => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [selectedPostType, setSelectedPostType] = useState('');
  const [visibleCount, setVisibleCount] = useState(3); // State for controlling visible posts
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const term = searchParams.get('searchTerm');
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
      const filtered = results.filter(post => 
        post.postType.toLowerCase() === selectedPostType.toLowerCase()
      );
      setFilteredResults(filtered);
    }
  };

  const fetchResults = async (term, type) => {
    setLoading(true);
    setResults([]);
    try {
      const response = await Api.get(`rentals/search?searchTerm=${encodeURIComponent(term)}&propertyType=${encodeURIComponent(type)}`);
      console.log('API Response:', response.data);
      const fetchedResults = response.data || [];
      // Filter out booked posts
      const availableResults = fetchedResults.filter(post => post.status !== 'Booked');
      setResults(Array.isArray(availableResults) ? availableResults : []);
      setFilteredResults(Array.isArray(availableResults) ? availableResults : []);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Current Search Term:', searchTerm);
    console.log('Current Property Type:', propertyType);
    fetchResults(searchTerm, propertyType);
  };

  const highlightText = (text, searchTerm) => {
    if (!text || !searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.split(regex).map((part, index) => 
      regex.test(part) ? <span key={index} className="bg-yellow-300">{part}</span> : part
    );
  };

  const handleViewPost = (postId) => {
    navigate(`/rental/${postId}`);
  };

  const getUniquePostTypes = () => {
    const types = [...new Set(results.map(post => post.postType))];
    return types;
  };

  const handleViewMore = () => {
    setVisibleCount(prevCount => prevCount + 3); 
  };

  const hasMorePosts = visibleCount < filteredResults.length;

  if (loading) return (
    <div className="h-screen w-full flex bg-gray-200 items-center justify-center">
      <div className="shadow-lg text-xl gap-6 bg-white flex flex-col items-center justify-center rounded-lg p-6">
        <p className='text-3xl'><FontAwesomeIcon icon={faRotate} className={`animate-spin`} /></p>
        <p>Searching please Wait.</p>
      </div>
    </div>
  );

  return (
    <>
      <NavBar />
      <div className='w-[75%] p-8 mx-auto flex items-center justify-center '>
        <div className='flex flex-col justify-center items-center '>
          {/* Search Box */}
          <div className='flex gap-6 items-center h-16 px-8 mb-4 justify-between w-full bg-blue-600/65 rounded-lg'>
            <form onSubmit={handleSearch} className="">
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="border border-gray-300 rounded p-2 mr-2"
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                Search
              </button>
            </form>
            {/* Post Type Filter */}
            <div className="">
              <select
                value={selectedPostType}
                onChange={(e) => setSelectedPostType(e.target.value)}
                className="border border-gray-300 rounded p-2"
              >
                <option value="">All Post Types</option>
                {getUniquePostTypes().map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {filteredResults.length === 0 ? (
            <p>No results found.</p>
          ) : (
            <div className="flex flex-wrap justify-between gap-8">
              {filteredResults.slice(0, visibleCount).map((post) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }} // Initial position for animation
                  animate={{ opacity: 1, y: 0 }} // Final position for animation
                  transition={{ duration: 0.3 }} // Animation duration
                  className="transform h-fit transition duration-300 hover:scale-105 w-[325px] border-brand-lightGrow border relative rounded-lg shadow-lg overflow-hidden group"
                >
                  <div className="relative">
                    {loading ? (
                      <div className="bg-gray-200 h-44">
                        <Skeleton height={176} />
                        <div className="p-4">
                          <Skeleton count={2} height={20} />
                          <Skeleton width="60%" height={20} className="mt-2" />
                        </div>
                      </div>
                    ) : Array.isArray(post.images) && post.images.length > 0 ? (
                      <div className="w-full h-44 relative">
                        <img
                          src={post.images[0]}
                          alt={post.postType}
                          className="w-full h-full object-cover object-center rounded-t-lg"
                        />
                        <h2 className="text-2xl w-full font-bold absolute top-0 left-0 uppercase text-brand-white pt-1 text-center bg-yellow-600">
                          {highlightText(post.postType, searchTerm)}
                        </h2>
                        <div className="absolute bottom-0 w-full justify-center flex text-center left-0 text-white text-xl font-extrabold transform">
                          <div className="bg-green-400 w-full flex items-center px-2 py-1 relative">
                            <p className="w-full text-center">
                              Rs. {Number(post.price).toLocaleString("en-IN")}
                            </p>
                            <p className="absolute right-0 w-1 h-1/2 bg-white "></p>
                            <p className="absolute left-0 w-1 h-1/2 bg-white "></p>
                          </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="bg-blue-400/40 hover:bg-green-400 font-bold px-4 py-2 rounded"
                            onClick={() => handleViewPost(post._id)}
                          >
                            BOOK NOW
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center h-36 flex items-center justify-center bg-brand-bgColor rounded-t-lg">
                        No image available
                      </p>
                    )}
                  </div>

                  <div className="py-2 px-4">
                    <div className="flex gap-5 mb-2">
                      <p>{highlightText(post.description, searchTerm)}</p>
                    </div>

                    {post.address ? (
                      <div>
                        <div className="flex gap-3">
                          <p>
                            <FontAwesomeIcon icon={faLocationDot} />
                          </p>
                          <p className="text-sm text-gray-500">
                            <strong>
                              {highlightText(post.address.district, searchTerm)}
                            </strong>
                            ,{" "}
                            <strong>
                              {highlightText(post.address.municipality, searchTerm)}
                            </strong>
                            <strong className="text-sm ml-1">
                              {highlightText(post.address.province, searchTerm)}
                            </strong>
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          {hasMorePosts && (
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleViewMore}
            >
              View More
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchResult;
