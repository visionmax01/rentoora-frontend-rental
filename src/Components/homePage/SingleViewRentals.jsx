import React, { useEffect, useState } from "react";
import Api from '../../utils/Api.js'
import KhaltiCheckout from "khalti-checkout-web";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "../NavBar";
import khaltiLogo from "../../assets/img/khalti_wallet.png";
import { FaSpinner } from 'react-icons/fa';
import { FaLocationDot, FaDollarSign, FaHouse } from 'react-icons/fa6';
import { motion } from "framer-motion";

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

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkLoginStatus();

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
      const response = await Api.get(`order/post/${postId}`);
      setPost(response.data);
      localStorage.setItem(`post_${postId}`, JSON.stringify(response.data));
      if (response.data.images && response.data.images.length > 0) {
        setSelectedImage(response.data.images[0]);
        localStorage.setItem(`selectedImage_${postId}`, response.data.images[0]);
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
        await placeOrder();
      }
    } finally {
      setIsOrdering(false);
    }
  };

  const initiateKhaltiPayment = () => {
    let config = {
      publicKey: "d7b416ae9dae43ebaae94c949e9bdafa",
      productIdentity: post._id,
      productName: post.postType,
      productUrl: `https://rentoora-backend-rental.onrender.com/rental/${post._id}`,
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
    checkout.show({ amount: post.price * 100 });
  };

  const placeOrder = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      await Api.post(
        "order/create",
        { postId: post._id, userId, paymentMethod },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await Api.patch(
        `order/post/${postId}`,
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
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error placing order");
      }
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
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <FaSpinner className="animate-spin text-blue-600 h-16 w-16" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center text-xl font-semibold">{error}</div>;
  }

  if (!post) {
    return <div className="text-center text-xl font-semibold">Post not found</div>;
  }

  if (post.status === "Booked") {
    return (
      <>
        <NavBar isLoggedIn={isLoggedIn} />
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
          <h1 className="text-3xl font-bold mb-4 text-center text-red-600 uppercase">
            Rental Post Already Booked
          </h1>
          <p className="text-center text-gray-700 text-lg">
            This rental post has already been booked and is no longer available for orders.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar isLoggedIn={isLoggedIn} />
      <div className="container mx-auto p-2 flex items-center justify-center h-fit">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-6 lg:pt-0 overflow-hidden"
        >
          
          <div className="lg:flex lg:p-6">
            <div className="lg:w-1/2 w-full lg:pr-6">
              <div className="mb-6 relative rounded-lg overflow-hidden shadow-lg shadow-gray-700">
                <h1 className="text-xl absolute top-1 left-1 font-bold rounded-lg w-fit py-2 px-4 bg-gray-300 text-blue-800 uppercase">
                {post.postType}
                </h1>
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="w-full h-[400px] object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-[400px] bg-gray-200 text-gray-400">
                    <FaHouse className="text-6xl" />
                  </div>
                )}
              </div>
              <div className="flex gap-4 p-3 rounded-lg  bg-white shadow-sm shadow-gray-400 border overflow-x-auto pb-2">
                {post.images.length > 0 ? (
                  post.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Post image ${index + 1}`}
                      className={`w-14 h-14 object-cover rounded cursor-pointer transition-all duration-200 ${
                        selectedImage === image ? "border-4 border-red-600" : "border-1 border-transparent hover:border-blue-400"
                      }`}
                      onClick={() => handleImageClick(image)}
                    />
                  ))
                ) : (
                  <div className="flex items-center gap-4 justify-center w-full">
                    {[1, 2, 3].map((_, index) => (
                      <div key={index} className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FaHouse className="text-3xl text-gray-400" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="lg:w-1/2 my-6 lg:mt-0 overflow-y-auto max-h-[calc(100vh-200px)]">
              <h2 className="text-2xl font-semibold mb-4">Rental Details</h2>
              <div className="text-gray-700 mb-6">
                {post.description.split(",").map((line, index) => (
                  <p key={index} className="flex items-start mb-2">
                    <span className="mr-2 text-blue-600">•</span>
                    {line.trim()}
                  </p>
                ))}
              </div>
              {post.address && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2 flex items-center">
                    <FaLocationDot className="mr-2 text-blue-600" />
                    Address
                  </h3>
                  <p className="text-gray-700 text-md">
                    <strong>{post.address.province}</strong>,{" "}
                    <strong>{post.address.district}</strong>,{" "}
                    <strong>{post.address.municipality}</strong>
                  </p>
                  <p className="text-gray-700 mt-1 text-md">
                    Landmark: <strong>{post.address.landmark}</strong>
                  </p>
                </div>
              )}
              <div className="mb-6">
                <p className="text-3xl font-bold text-green-600">
                  Rs.{Number(post.price).toLocaleString("en-IN")}
                </p>
              </div>
              <button
                onClick={handleOrder}
                className="bg-blue-600 w-fit text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-300 shadow-lg"
              >
                Book Now
              </button>
            </div>
          </div>
        </motion.div>

        {showPaymentPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white w-full max-w-md p-6 rounded-lg shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 border-b pb-2">
                Select Payment Method
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-lg font-semibold mb-2">1. Online Payment</p>
                  <label className="flex items-center space-x-3 bg-gray-100 p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition duration-200">
                    <input
                      type="radio"
                      value="Wallet"
                      checked={paymentMethod === "Wallet"}
                      onChange={handlePaymentMethodChange}
                      className="form-radio h-5 w-5 text-blue-600"
                    />
                    <img src={khaltiLogo} className="h-8" alt="Khalti Logo" />
                  </label>
                </div>
                <div>
                  <p className="text-lg font-semibold mb-2">2. Offline Mode</p>
                  <label className="flex items-center space-x-3 bg-gray-100 p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition duration-200">
                    <input
                      type="radio"
                      value="Cash on Delivery"
                      checked={paymentMethod === "Cash on Delivery"}
                      onChange={handlePaymentMethodChange}
                      className="form-radio h-5 w-5 text-blue-600"
                    />
                    <span>Cash on Delivery</span>
                  </label>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  onClick={confirmOrder}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition duration-300 flex items-center justify-center w-1/2 mr-2"
                  disabled={isOrdering}
                >
                  {isOrdering ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" /> Processing...
                    </>
                  ) : (
                    "Confirm Order"
                  )}
                </button>
                <button
                  onClick={() => setShowPaymentPopup(false)}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition duration-300 w-1/2 ml-2"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default SingleViewRental;
