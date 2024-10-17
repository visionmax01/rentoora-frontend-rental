// Function to decode base64 URL
const base64UrlDecode = (base64Url) => {
  // Replace URL-safe characters with standard base64 characters
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const decodedData = atob(base64);
  return JSON.parse(decodedData);
};

// Function to get the logged-in user ID from the token
const getLoggedInUserId = () => {
  const token = localStorage.getItem("token"); // Retrieve the token from local storage
  if (token) {
    try {
      // Split the token to get the payload part
      const payload = token.split('.')[1]; // Get the payload part
      const decodedPayload = base64UrlDecode(payload); // Decode the payload
      return decodedPayload.id; // Return user ID from the decoded token
    } catch (error) {
      console.error("Error decoding token:", error);
      return null; // Return null if the token is invalid
    }
  }
  return null; // Return null if no token is found
};

export default getLoggedInUserId;
