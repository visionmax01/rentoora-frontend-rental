import React, { useEffect, useState } from "react";
import axios from "axios";
import KhaltiCheckout from "khalti-checkout-web";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import NavBar from "../NavBar";
import khaltiLogo from "../../assets/img/khalti_wallet.png";
import { FaSpinner } from 'react-icons/fa';

const SingleViewRental = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isOrdering, setIsOrdering] = useState(false); // Add state for loading

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkLoginStatus();
    
    // Fetch post details or use saved post
    const savedPost = JSON.parse(localStorage.getItem(`post_${postId}`));
    const savedImage = localStorage.getItem(`selectedImage_${postId}`);
    
    if (savedPost) {
      setPost(savedPost);
      setSelectedImage(savedImage || savedPost.images[0]);
      setLoading(false);
    } else {
      fetchPostDetails();
    }
  }, [postId]);

  const fetchPostDetails = async () => {
    try {
      const response = await axios.get(
        `https://rentoora-backend-rental.onrender.com/order/post/${postId}`
      );
      setPost(response.data);
      setSelectedImage(response.data.images[0]);
    } catch (error) {
      setError("Error fetching post details");
      toast.error("Error fetching post details");
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = () => {
    if (!isLoggedIn) {
      toast.error("You need to log in first!");
      navigate("/client-login");
    } else {
      setShowPaymentPopup(true);
    }
  };

  const confirmOrder = async () => {
    if (!isLoggedIn) {
      toast.error("You need to log in first!");
      navigate("/client-login");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setIsOrdering(true); // Start loading

    try {
      if (paymentMethod === "Wallet") {
        initiateKhaltiPayment();
      } else {
        await placeOrder(); // Handle cash on delivery
      }
    } finally {
      setIsOrdering(false); // Stop loading
    }
  };

  const initiateKhaltiPayment = () => {
    let config = {
      publicKey: "YOUR_KHALTI_PUBLIC_KEY",
      productIdentity: post._id,
      productName: post.postType,
      productUrl: `http://localhost:3000/rental/${post._id}`,
      eventHandler: {
        onSuccess(payload) {
          verifyKhaltiPayment(payload);
        },
        onError(error) {
          toast.error("Payment failed");
          console.log(error);
        },
        onClose() {
          console.log("Payment widget closed");
        },
      },
      paymentPreference: ["KHALTI"],
    };

    let checkout = new KhaltiCheckout(config);
    checkout.show({ amount: post.price * 100 }); // Amount in paisa
  };

  const placeOrder = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      await axios.post(
        "https://rentoora-backend-rental.onrender.com/order/create",
        { postId: post._id, userId, paymentMethod },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update post status to "Booked"
      await axios.patch(
        `https://rentoora-backend-rental.onrender.com/order/post/${postId}`,
        { status: "Booked" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Order placed successfully");
      navigate("/booked-order");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(
        error.response?.data?.message || "Error placing order"
      );
    }
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    localStorage.setItem(`selectedImage_${postId}`, image);
  };

  if (loading) {
    return (
      <div className="text-center flex justify-center items-center flex-col w-full h-screen">
        <FaSpinner className="animate-spin text-brand-Black h-10 w-10 mr-3" />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!post) {
    return <div className="text-center">Post not found</div>;
  }

  return (
    <>
      <NavBar isLoggedIn={isLoggedIn} />
      <div className="container w-full p-4">
        <div className="lg:flex gap-4">
          {/* Rental Details and Order Now Button */}
          <div>
            {/* Rental Details */}
            {/* Order Now Button */}
            <button
              onClick={handleOrder}
              className="bg-blue-600 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition duration-300 flex items-center"
              disabled={isOrdering}
            >
              {isOrdering ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Ordering...
                </>
              ) : (
                "Order Now"
              )}
            </button>
          </div>
        </div>

        {/* Payment Popup */}
        {showPaymentPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-[400px] p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-center">Select Payment Method</h2>

              {/* Payment Method Options */}
              <div>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Wallet"
                    checked={paymentMethod === "Wallet"}
                    onChange={handlePaymentMethodChange}
                  />
                  <img src={khaltiLogo} className="h-12" alt="Khalti" />
                </label>

                <label className="flex items-center mt-4">
                  <input
                    type="radio"
                    value="Cash on Delivery"
                    checked={paymentMethod === "Cash on Delivery"}
                    onChange={handlePaymentMethodChange}
                  />
                  Cash on Delivery
                </label>
              </div>

              {/* Confirm and Cancel Buttons */}
              <div className="mt-6 flex justify-between">
                <button
                  onClick={confirmOrder}
                  className="bg-green-600 text-white px-4 py-2 rounded flex items-center"
                  disabled={isOrdering}
                >
                  {isOrdering ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" /> Confirming...
                    </>
                  ) : (
                    "Confirm Order"
                  )}
                </button>
                <button
                  onClick={() => setShowPaymentPopup(false)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SingleViewRental;
