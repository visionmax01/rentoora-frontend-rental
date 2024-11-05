import React, { useEffect, useState, useRef } from "react";
import Api from "../../utils/Api.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import NavBar from "../../Components/NavBar.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import Fuse from "fuse.js";
import Skeleton from "react-loading-skeleton"; // Import the Skeleton component
import 'react-loading-skeleton/dist/skeleton.css'; // Import skeleton CSS for default styling
import sale from "../../assets/img/for-rent.png";

const RentalServiceDisplay = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const defaultPostsToShow = 8;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await Api.get("order/display-posts");
        setPosts(response.data);
      } catch (error) {
        setError("Error fetching posts");
        toast.error("Error fetching posts");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-300">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

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
      setSearchResults(results.map((result) => result.item));
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

  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <>
      <NavBar />
      <div className="container mx-auto bg-white p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          ALL AVAILABLE RENTALS
        </h1>

        <div className="mb-4 flex justify-center space-x-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            ref={searchInputRef}
            placeholder="Search by type, location, etc."
            className="border-2 outline-none p-2 w-[300px] border-blue-700 focus:border-blue-700"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>

        {isSearching && (
          <div className="flex items-center justify-center mt-10">
            <FaSpinner className="animate-spin h-10 w-10" />
          </div>
        )}

        <div className="w-full flex justify-center p-4">
          <div className="flex flex-wrap justify-center gap-8">
            {(searchAttempted
              ? searchResults
              : posts.slice(0, defaultPostsToShow)
            ).length > 0
              ? (searchAttempted
                  ? searchResults
                  : posts.slice(0, defaultPostsToShow)
                ).map((post) => (
                  <div
                    key={post._id}
                    className="transform h-fit transition duration-300 hover:scale-105 w-[325px] border-brand-lightGrow border relative rounded-lg shadow-lg overflow-hidden group"
                  >
                    <div className="relative">
                      {loading ? ( // Show custom skeleton if loading
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
                          <img
                            className="w-12 h-12 absolute top-3 shadow-lg shadow-white/25 right-3"
                            src={sale}
                            alt=""
                          />
                          {/* Red Banner for Price */}
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
                  </div>
                ))
              : !loading && searchAttempted && (
                  <p className="text-red-500 text-center">
                    No results found for "{searchTerm}"
                  </p>
                )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RentalServiceDisplay;
