import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import "./index.css";
import { Toaster } from "react-hot-toast";
import Homepage from "./Components/homePage/homepage.jsx";
import Developer from "./Components/homePage/develober.jsx";
import AboutUs from "./Components/homePage/about.jsx";
import OurServices from "./Components/homePage/ourServices.jsx";
import RentalServiceDisplay from './Components/homePage/rentalServiceDisplay.jsx'
import BookedOrder from './Components/homePage/BookedOrderststus.jsx'
import SingleViewRentals from './Components/homePage/SingleViewRentals.jsx'
import SearchResult from './Components/homePage/SearchResult.jsx'
//uitls imports
import ProtectedRoute from './utils/ProtectedRoute.jsx'
//import admin pages
import AdminDashboard from "./AdminSide/AdminDashboard.jsx";
import AdminProfile from './AdminSide/adminProfile.jsx'
import ClientList from './AdminSide/ClientList.jsx'
import DisplayClientPosts from './AdminSide/DisplayClientPosts.jsx'
import AdminChangepass from './AdminSide/AdminChangepass.jsx'
//import authFiles
import Login from './authfiles/Login.jsx'
import Register from './authfiles/Register.jsx'
import ResetPasswordFlow from './authfiles/ResetPasswordFlow.jsx'
//import client/user side 
import ClientProfile from './ClientSide/clientProfile.jsx'
import ClientDashHome from './ClientSide/clientDashHome.jsx'
import ChangePassword from './ClientSide/ChangePassword.jsx'
import ReceivedOrders from  './ClientSide/ReceivedOrders.jsx'
import MyOrders from './Myorder/MyOrders.jsx'
import FeedbackList from "./AdminSide/DiaplayallFeadback.jsx";
import FeedbackForm from "./utils/FeedbackForm.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WelcomePage from "./BookServiceprovider/WelcomePage.jsx";
import BookingForm from "./BookServiceprovider/BookingForm.jsx";
import ProviderBookingList from "./ClientSide/bookedServicesP/ProviderBookingList.jsx";
import UserBookingList from "./ClientSide/bookedServicesP/UserBookingList.jsx";
import ProviderFeedbackForm from "./utils/providerFeedbackForm.jsx";
import DisplayElectronicItems from "./Components/homePage/displayElectronicItems.jsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/developer" element={<Developer />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/service" element={<OurServices />} />
          <Route path="/client-login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-pass" element={<ResetPasswordFlow />} />
          <Route path="/rental-service" element={<RentalServiceDisplay />} />
          <Route path="/buy-electronic" element={<DisplayElectronicItems />} />
          <Route path="/rental/:postId" element={<SingleViewRentals />} />
          <Route path="/booked-order" element={<BookedOrder />} />
          <Route path="/Search/:searchTerm" element={<SearchResult />} />
          <Route path="/feadBackform" element={<FeedbackForm />} /> 
          <Route path="/search" element={<SearchResult />} /> 
          <Route path="/provider-feedback/:bookingId" element={<ProviderFeedbackForm />} />

          {/* Protected Routes for Clients */}
          <Route
            element={<ProtectedRoute allowedRoles={[0]} redirectPath="/client-dashboard" />}
          >
            <Route path="/services-booking-system" element={<WelcomePage />} />
            <Route path="/sb-form" element={<BookingForm />} />
            <Route path="/client-dashboard" element={<ClientDashHome />} />
            <Route path="/client-profile" element={<ClientProfile />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/user-orders" element={<MyOrders />} />
            <Route path="/order-recieved" element={<ReceivedOrders />} />
            <Route path="/booking-available" element={<ProviderBookingList />} />
            <Route path="/booked-providers" element={<UserBookingList />} />
          </Route>

          {/* Protected Routes for Admins */}
          <Route
            element={<ProtectedRoute allowedRoles={[1]} redirectPath="/admin-dashboard" />}
          >
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-profile" element={<AdminProfile />} />
            <Route path="/admin-change-password" element={<AdminChangepass />} />
            <Route path="/client-list" element={<ClientList />} />
            <Route path="/client-posts" element={<DisplayClientPosts />} />
            <Route path="/Diaplay-feedback" element={<FeedbackList />} />
          </Route>
          
          {/* Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  );
}

export default App;
