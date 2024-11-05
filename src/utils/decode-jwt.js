import * as jwt_decode from 'jwt-decode';

/**
 * Utility function to extract the userId from the JWT token stored in localStorage.
 * @returns {string|null} userId or null if token is invalid or not found.
 */
export const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwt_decode(token);
      return decoded.userId; 
    } catch (err) {
      console.error("Failed to decode token:", err);
      return null;
    }
  }
  return null;  
};

