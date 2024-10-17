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
  const [isOrdering, setIsOrdering] = useState(false); 


  // Check login status and try to load saved state from localStorage
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkLoginStatus();

    // Try to load saved post data and selected image from localStorage
    const savedPost = JSON.parse(localStorage.getItem(`post_${postId}`));
    const savedImage = localStorage.getItem(`selectedImage_${postId}`);

    if (savedPost) {
      setPost(savedPost);
      if (savedImage) {
        setSelectedImage(savedImage);
      } else if (savedPost.images && savedPost.images.length > 0) {
        setSelectedImage(savedPost.images[0]);
      }
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
      localStorage.setItem(`post_${postId}`, JSON.stringify(response.data)); // Save post to localStorage
      if (response.data.images && response.data.images.length > 0) {
        setSelectedImage(response.data.images[0]);
        localStorage.setItem(
          `selectedImage_${postId}`,
          response.data.images[0]
        ); // Save selected image to localStorage
      }
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
    setIsOrdering(true);
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

  const verifyKhaltiPayment = async (payload) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      const verificationResponse = await axios.post(
        "https://rentoora-backend-rental.onrender.com/payment/khalti/verify",
        {
          token: payload.token,
          amount: payload.amount,
          userId,
          postId: post._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (verificationResponse.data.success) {
        toast.success("Payment successful");
        await placeOrder(); // Proceed with order placement after payment is successful
      } else {
        toast.error("Payment verification failed");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error("Payment verification failed");
    }
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

        // Update the post status to "Booked"
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
        // Check if the error response contains a message from the backend
        if (error.response && error.response.data && error.response.data.message) {
            toast.error(error.response.data.message);
        } else {
            toast.error("Error placing order"); // Fallback error message
        }
    }
};


  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    localStorage.setItem(`selectedImage_${postId}`, image); // Save selected image to localStorage
  };

  if (loading) {
    return <div className="text-center flex justify-center items-center flex-col w-full h-screen">
      <FaSpinner className="animate-spin text-brand-Black h-10 w-10 text- mr-3" />
      <p>Loading...</p>
      </div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!post) {
    return <div className="text-center">Post not found</div>;
  }

  if (post.status === "Booked") {
    return (
      <>
        <NavBar isLoggedIn={isLoggedIn} />
        <div className="container w-full p-6">
          <h1 className="text-2xl font-bold mb-4 ml-32 uppercase">
            Rental Post Already Booked
          </h1>
          <p className="text-center text-red-500">
            This rental post has already been booked and is no longer available
            for orders.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar isLoggedIn={isLoggedIn} />
      <div className="container w-full p-4">
        {/* Rental Post Details */}
        <h1 className="text-2xl font-bold mb-4 lg:ml-32 uppercase">
          {post.postType}
        </h1>
        <div className="lg:flex  gap-4">
          <div className="lg:w-1/2 lg:ml-32">
            {/* Image Display */}
            <div className="lg:h-[450px] h-[220px] rounded-lg mb-4 bg-gray-200 flex justify-center items-center">
              {selectedImage ? (
                <img
                  src={`https://rentoora-backend-rental.onrender.com/${selectedImage}`}
                  alt="Selected"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-center">
                  <i className="fa-solid fa-house text-blue-400 text-5xl"></i>
                  <p>Image not Uploaded..</p>
                  <p>No image available to view</p>
                </div>
              )}
            </div>

            <div className="flex gap-4 mb-4 border rounded-lg w-fit p-2">
              {post.images.length > 0 ? (
                post.images.map((image, index) => (
                  <img
                    key={index}
                    src={`https://rentoora-backend-rental.onrender.com/${image}`}
                    alt={`Post image ${index + 1}`}
                    className={`lg:w-20 lg:h-20 w-12 h-12 object-cover rounded-lg cursor-pointer ${
                      selectedImage === image ? "border-2 border-blue-600" : ""
                    }`}
                    onClick={() => handleImageClick(image)}
                  />
                ))
              ) : (
                <div className="flex items-center gap-4 justify-center w-12 h-12 lg:w-full lg:h-20 text-blue-400">
                  <i className="fa-solid fa-house lg:text-5xl  text-3xl  px-4 py-2 bg-gray-200 rounded-lg"></i>
                  <i className="fa-solid fa-house lg:text-5xl  text-3xl px-4 py-2 bg-gray-200 rounded-lg"></i>
                  <i className="fa-solid fa-house lg:text-5xl  text-3xl px-4 py-2 bg-gray-200 rounded-lg"></i>
                </div>
              )}
            </div>
          </div>

          <div className="p-2">
            <h1 className="font-semibold text-lg">Rental Details</h1>
            <div className="text-gray-700 mt-4">
              {post.description.split(",").map((line, index) => (
                <p key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  {line.trim()}
                </p>
              ))}
            </div>
            {post.address ? (
                      <div>
                        <p>
                          Address: &nbsp;{" "}
                          <strong>{post.address.province}</strong>,{" "}
                          <strong>{post.address.district}</strong>,{" "}
                          <strong>{post.address.municipality}</strong>
                        </p>
                        <div>
                          Landmark: <strong>{post.address.landmark}</strong>
                        </div>
                      </div>
                    ) : (
                      "No data found"
                    )}
          
            <p className="text-lg font-bold text-gray-400">
              Price:{" "}
              <span className="text-3xl text-green-600">
                Rs.{Number(post.price).toLocaleString("en-IN")}
              </span>
            </p>
            <div className="mt-6">
              <button
                onClick={handleOrder}
                className="bg-blue-600 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition duration-300"
              >
                Order Now
              </button>
            </div>
          </div>
        </div>

        {/* Payment Popup */}
        {showPaymentPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2">
            <div className="bg-white relative w-[400px] p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-center py-2 h-fit text-gray-800  absolute left-0 rounded-t-lg top-0 bg-blue-400 w-full">
                Select Payment Method
              </h2>
              <div>
                <p className="text-md font-semibold  mt-8">
                  1. Online Payment *
                </p>
                <label className="flex rounded bg-gray-200 p-2">
                  <input
                    type="radio"
                    value="Wallet"
                    checked={paymentMethod === "Wallet"}
                    onChange={handlePaymentMethodChange}
                  />
                  <img src={khaltiLogo} className="h-12 " alt="" />
                </label>
                <br />
                <p className="text-md font-semibold  ">2. Offline Mode *</p>
                <label className="flex gap-2 bg-gray-200 p-2 rounded mb-6">
                  <input
                    type="radio"
                    value="Cash on Delivery"
                    checked={paymentMethod === "Cash on Delivery"}
                    onChange={handlePaymentMethodChange}
                  />
                  Cash on Delivery
                </label>
              </div>
              <div className="mt-4 flex gap-8">
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
