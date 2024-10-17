import React from 'react';
import RoomIcon from "../../assets/img/rent-img.avif";
import Electrician from '../../assets/img/electrician1.jpg';
import SellPhone from '../../assets/img/buy_sell-phone.jpg';
import NavBar from '../NavBar';
import Footer from '../Footer';
import {Link} from 'react-router-dom'

const OurServices = () => {
  return (
    <div className="ourServices bg-gray-50" >
    <NavBar/>
    <section className=" py-12 ">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="md:text-4xl text-xl  font-bold text-gray-800">
            Our Services at Rentoora
          </h1>
          <p className="md:w-48 w-28 h-1  md:mt-1 rounded-full bg-red-600 mx-auto"></p>

          <p className="text-gray-600 mt-4">
            Explore our range of services designed to make your life easier.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:w-[85%] mx-auto">
          {/* Service 1 - Rentals */}
          <div className="relative p-6  bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <img
              src={RoomIcon}
              alt="Rentals"
              className="w-full h-56 object-fit rounded-md"
            />
            <div className="mt-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                House & Apartment Rentals
              </h3>
              <p className="text-gray-600 mt-2 mb-20">
                Find and rent rooms, houses, or apartments with ease. We offer a
                variety of properties to suit every budget and need.
              </p>
              <Link to="/rental-service" className="absolute bottom-6  bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded  transition-colors duration-300">
                Explore Rentals
              </Link>
            </div>
          </div>

          {/* Service 2 - Electrician Booking */}
          <div className="relative p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <img
              src={Electrician}
              alt="Electricians"
              className="w-full h-56 object-fit rounded-md"
            />
            <div className="mt-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                Book an Electrician
              </h3>
              <p className="text-gray-600 mt-2 mb-20">
                Need reliable electrical services? Book our trusted electricians
                for fast and professional work.
              </p>
              <button className=" absolute bottom-6 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded  transition-colors duration-300">
                Book Now
              </button>
            </div>
          </div>

          {/* Service 3 - Buy/Sell Phones */}
          <div className="relative p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <img
              src={SellPhone}
              alt="Phones"
              className="w-full h-56 object-fit rounded-md"
            />
            <div className="mt-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                Buy/Sell Old Phones
              </h3>
              <p className="text-gray-600 mt-2 mb-20">
                Buy or sell pre-owned phones through our platform with
                transparency and trust.
              </p>
              <button className="absolute bottom-6 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded  transition-colors duration-300">
                View Deals
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="container mx-auto px-6 mt-16 text-center md:w-[90%]">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg shadow-lg bg-white">
            <h4 className="text-xl font-semibold text-gray-700 mb-2">Trusted Providers</h4>
            <p className="text-gray-600">
              We partner with reliable service providers to ensure you receive top-quality service.
            </p>
          </div>

          <div className="p-6 border rounded-lg shadow-lg bg-white">
            <h4 className="text-xl font-semibold text-gray-700 mb-2">Transparent Pricing</h4>
            <p className="text-gray-600">
              No hidden fees. All our services are priced clearly so you know exactly what you're paying for.
            </p>
          </div>

          <div className="p-6 border rounded-lg shadow-lg bg-white">
            <h4 className="text-xl font-semibold text-gray-700 mb-2">Customer Support</h4>
            <p className="text-gray-600">
              Our team is here to help you with any questions or issues you might have.
            </p>
          </div>
        </div>
      </div>
    </section>
    <Footer/>
    </div>
  );
};

export default OurServices;