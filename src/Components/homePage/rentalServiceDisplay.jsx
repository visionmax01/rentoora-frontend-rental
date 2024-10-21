import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { locationData } from "../../utils/LocationData.jsx"; // Import the location data
import { FaSpinner } from 'react-icons/fa';
import NavBar from "../../Components/NavBar.jsx";

const RentalServiceDisplay = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [municipalityFilter, setMunicipalityFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [districtOptions, setDistrictOptions] = useState([]);
  const [municipalityOptions, setMunicipalityOptions] = useState([]);
  const [isSearching, setIsSearching] = useState(false); // Track if a search is in progress
  const [searchResults, setSearchResults] = useState([]); // Store search results
  const [searchAttempted, setSearchAttempted] = useState(false); // Track if a search has been attempted
  const navigate = useNavigate();
  const searchInputRef = useRef(null); // Create a ref for the input field
  const defaultPostsToShow = 4; // Number of posts to display by default

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "https://rentoora-backend-rental.onrender.com/order/display-posts"
        );
        setPosts(response.data);
      } catch (error) {
        setError("Error fetching posts");
        toast.error("Error fetching posts");
      } finally {
        setLoading(false); // Stop loading after posts are fetched
      }
    };

    fetchPosts();
  }, []);

  // Focus on the input field only after the component mounts
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus(); // Focus on the input field when the component mounts
    }
  }, []);

  // Handle province selection to update districts
  const handleProvinceChange = (province) => {
    setProvinceFilter(province);
    const selectedProvince = locationData.find((p) => p.name === province);
    setDistrictOptions(selectedProvince ? selectedProvince.districts : []);
    setDistrictFilter(""); // Reset district when province changes
    setMunicipalityOptions([]); // Reset municipality when province changes
    setMunicipalityFilter(""); // Reset municipality filter
  };

  // Handle district selection to update municipalities
  const handleDistrictChange = (district) => {
    setDistrictFilter(district);
    const selectedDistrict = districtOptions.find((d) => d.name === district);
    const combinedMunicipalities = [
      ...(selectedDistrict?.municipalities || []),
      ...(selectedDistrict?.ruralMunicipalities || []),
    ];
    setMunicipalityOptions(combinedMunicipalities);
    setMunicipalityFilter(""); // Reset municipality filter when district changes
  };

  // Search for posts based on the search term
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      // Show a popup message if the input is empty
      toast.error("Please provide a location for search.");
      return;
    }

    setSearchAttempted(true); // Set search attempted to true
    setIsSearching(true); // Set searching to true
    setLoading(true); // Show loading during search

    // Simulate loading time
    setTimeout(() => {
      const searchLower = searchTerm.toLowerCase();

      // Filter posts based on the search term
      const results = posts.filter((post) => {
        const postTypeMatch = post.postType.toLowerCase().includes(searchLower);
        const provinceMatch = post.address?.province
          .toLowerCase()
          .includes(searchLower);
        const districtMatch = post.address?.district
          .toLowerCase()
          .includes(searchLower);
        const municipalityMatch = post.address?.municipality
          .toLowerCase()
          .includes(searchLower);
        const descriptionMatch = post.description
          ?.toLowerCase()
          .includes(searchLower);

        return (
          postTypeMatch ||
          provinceMatch ||
          districtMatch ||
          municipalityMatch ||
          descriptionMatch
        );
      });

      setSearchResults(results); // Set the search results
      setLoading(false); // Stop loading after search
      setIsSearching(false); // Reset searching state
      if (searchInputRef.current) {
        searchInputRef.current.focus(); // Re-focus the input field after search
      }
    }, 1000); // Delay the display of results for 1 second
  };

  // Handle the Enter key press to trigger search
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(); // Trigger search on Enter key
    }
  };

  // Filter the search results based on the selected filters
  const filteredResults = searchResults.filter((post) => {
    const postTypeFilter = filter === "" || post.postType === filter;
    const provinceFilterMatch =
      provinceFilter === "" || post.address?.province === provinceFilter;
    const districtFilterMatch =
      districtFilter === "" || post.address?.district === districtFilter;
    const municipalityFilterMatch =
      municipalityFilter === "" ||
      post.address?.municipality === municipalityFilter;
    const statusMatch = post.status !== "Booked";

    return (
      postTypeFilter &&
      provinceFilterMatch &&
      districtFilterMatch &&
      municipalityFilterMatch &&
      statusMatch
    );
  });

  const handleViewPost = (postId) => {
    navigate(`/rental/${postId}`);
  };

  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <>
      <NavBar/>
      <div className="container mx-auto bg-white p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        ALL AVAILABLE RENTALS
      </h1>

      {/* Search input field and button */}
      <div className="mb-4 flex justify-center space-x-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term on change
          onKeyPress={handleKeyPress} // Trigger search on Enter key
          ref={searchInputRef} // Attach the ref to the input
          placeholder="Search by type, location, province, etc."
          className="border-2 outline-none p-2 w-[300px] border-blue-700 focus:border-blue-700"
        />
        <button
          onClick={handleSearch} // Trigger search on button click
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* Display loading spinner while searching */}
      {isSearching && (
        <div className="flex items-center justify-center mt-10">
          <div className="loader"><FaSpinner className="animate-spin h-10 w-10 mr-3" /></div>
        </div>
      )}

      {/* Show filter options only if there are search results */}
      {searchAttempted && searchResults.length > 0 && (
        <div className="mb-4 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
          {/* Filters */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border-2 outline-none p-2 w-[200px] border-blue-700 focus:border-blue-700"
          >
            <option value="">All Types</option>
            <option value="Room">Room</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
          </select>

          <select
            value={provinceFilter}
            onChange={(e) => handleProvinceChange(e.target.value)}
            className="border-2 outline-none p-2 w-[200px] border-blue-700 focus:border-blue-700"
          >
            <option value="">All Provinces</option>
            {locationData.map((province) => (
              <option key={province.name} value={province.name}>
                {province.name}
              </option>
            ))}
          </select>

          <select
            value={districtFilter}
            onChange={(e) => handleDistrictChange(e.target.value)}
            disabled={!districtOptions.length}
            className="border-2 outline-none p-2 w-[200px] border-blue-700 focus:border-blue-700"
          >
            <option value="">All Districts</option>
            {districtOptions.map((district) => (
              <option key={district.name} value={district.name}>
                {district.name}
              </option>
            ))}
          </select>

          <select
            value={municipalityFilter}
            onChange={(e) => setMunicipalityFilter(e.target.value)}
            disabled={!municipalityOptions.length}
            className="border-2 outline-none p-2 w-[200px] border-blue-700 focus:border-blue-700"
          >
            <option value="">All Municipalities</option>
            {municipalityOptions.map((municipality) => (
              <option key={municipality.name} value={municipality.name}>
                {municipality.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Posts display */}
      <div className="w-full flex justify-center p-4">
        <div className="flex flex-wrap justify-center gap-8">
          {(searchAttempted ? filteredResults : posts.slice(0, defaultPostsToShow)).length > 0
            ? (searchAttempted ? filteredResults : posts.slice(0, defaultPostsToShow)).map((post) => (
                <div
                  key={post._id}
                  className="transform transition duration-300 hover:scale-105 w-[325px] border-brand-lightGrow border relative rounded-lg shadow-lg overflow-hidden"
                >
                  <div>
                    {Array.isArray(post.images) && post.images.length > 0 ? (
                      <img
                        src={post.images[0]}
                        alt={post.postType}
                        className="w-full h-32 object-cover rounded-t-lg "
                      />
                    ) : (
                      <p className="text-gray-500 text-center h-36 flex items-center justify-center bg-brand-bgColor rounded-t-lg">
                        No image available
                      </p>
                    )}
                    <h2 className="text-xl font-bold uppercase text-brand-white pt-1 text-center bg-brand-lightdark">
                      {post.postType}
                    </h2>
                  </div>
                  <div className="p-4">
                    <div className="mt-2 flex gap-5 mb-2 ">
                      <p>Detail's:</p>
                      <p>
                        {post.description.length > 50
                          ? `${post.description.substring(0, 50)}...`
                          : post.description}
                      </p>
                    </div>

                    {post.address ? (
                      <div>
                        <div className="flex gap-3">
                          <p>Address: &nbsp;{" "}</p>
                          <p className="text-sm">
                            <strong>{post.address.district}</strong>,{" "}
                            <strong>{post.address.municipality}</strong>
                          </p>
                        </div>
                        <div>
                          Landmark: <strong className="text-sm ml-1">{post.address.landmark}</strong>
                        </div>
                        <p className="text-md absolute right-0 text-brand-white pl-6 pr-4 bottom-4 py-1 rounded-tl-full bg-brand-Black font-bold">
                          <span className="text-xl text-green-600">
                            Rs. <span className="text-2xl">{Number(post.price).toLocaleString("en-IN")}</span>
                          </span>
                        </p>
                      </div>
                    ) : (
                      "No data found"
                    )}
                    <button
                      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() => handleViewPost(post._id)}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            : searchAttempted && (
                <p className="text-center text-gray-500 col-span-full">
                  No posts available according to your search. Please search for
                  Room, Apartment, House according to your location.
                </p>
              )}
        </div>
      </div>
    </div>
    </>
   
  );
};

export default RentalServiceDisplay;
