import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const SearchResult = () => {
  const { searchTerm } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [propertyType, setPropertyType] = useState(""); // State for property type filter
  const [searchInput, setSearchInput] = useState(searchTerm || ""); // State for search input
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("https://rentoora-backend-rental.onrender.com/order/display-posts");
        setPosts(response.data);
        // Filter posts based on the initial searchTerm from the URL
        filterPosts(searchTerm);
      } catch (error) {
        setError("Error fetching posts");
        toast.error("Error fetching posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchTerm]); // Fetch posts only when the component mounts or searchTerm changes

  // Filter posts based on the searchInput and propertyType
  const filterPosts = (searchTerm) => {
    if (searchTerm && posts.length > 0) {
      const searchLower = searchTerm.toLowerCase();
      const results = posts.filter((post) => {
        const provinceMatch = post.address?.province.toLowerCase().includes(searchLower);
        const districtMatch = post.address?.district.toLowerCase().includes(searchLower);
        const municipalityMatch = post.address?.municipality.toLowerCase().includes(searchLower);
        const postTypeMatch = post.postType.toLowerCase().includes(searchLower);
        const propertyTypeMatch = propertyType ? post.postType.toLowerCase() === propertyType : true;

        // Exclude booked posts
        const isBooked = post.status && post.status.toLowerCase() === "booked"; // Check if post is booked

        return (provinceMatch || districtMatch || municipalityMatch || postTypeMatch) && propertyTypeMatch && !isBooked;
      });
      setFilteredPosts(results);
    } else {
      setFilteredPosts(posts.filter(post => !post.status || post.status.toLowerCase() !== "booked")); // Show only available posts
    }
  };

  // Handle the search button click
  const handleSearchClick = () => {
    filterPosts(searchInput); // Filter based on new input
    navigate(`/Search/${encodeURIComponent(searchInput)}`); // Update the URL for the new search term
  };

  const handleViewPost = (postId) => {
    navigate(`/rental/${postId}`);
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handlePropertyTypeChange = (e) => {
    setPropertyType(e.target.value);
    filterPosts(searchInput); // Refilter posts when property type changes
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto bg-white p-6">

      {/* Search Input and Filter */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchInputChange}
          placeholder="Search by location..."
          className="border rounded-lg px-4 py-2 w-64"
        />
        <select
          value={propertyType}
          onChange={handlePropertyTypeChange}
          className="border rounded-lg px-4 py-2 ml-2"
        >
          <option value="">All Types</option>
          <option value="room">Room</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
        </select>
        <button
          onClick={handleSearchClick}
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2 hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* Posts display */}
      <h1 className="text-2xl font-bold mb-4 text-center">Search Results</h1>
      <div className="flex justify-center">

        <div className="flex gap-4 justify-center items-center  flex-col w-1/2 mx-auto">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={post._id} className=" w-[70%]  border-2 relative border-gray-300 rounded-lg shadow-lg overflow-hidden">
                <h2 className="absolute top-0 left-0 rounded-tl-lg text-xl text-white font-bold text-center bg-blue-400 opacity-95 uppercase px-2 py-1">
                  {post.postType}
                </h2>
                <div>
                  {Array.isArray(post.images) && post.images.length > 0 && (
                    <img
                      src={`https://rentoora-backend-rental.onrender.com/${post.images[0]}`}
                      alt={post.postType}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-500"
                    />
                  )}
                </div>
                <div className="p-4">
                  <p className="text-gray-700">{post.description}</p>
                  <p className="text-lg font-bold">
                    Price: Rs.<span className="text-3xl text-green-600">{Number(post.price).toLocaleString("en-IN")}</span>
                  </p>
                  <p className="text-gray-600">Area: {post.address?.district || "N/A"}</p>
                  <button
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => handleViewPost(post._id)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">No available posts for "{searchTerm}".</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
