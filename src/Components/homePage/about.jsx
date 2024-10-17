import React from "react";
import NavBar from "../NavBar";
import RoomIcon from "../../assets/img/rent-img.avif";
import Electrician from '../../assets/img/electrician1.jpg';
import SellPhone from '../../assets/img/buy_sell-phone.jpg';
import Footer from "../Footer";

const About = () => {
  return (
    <>
    <NavBar/>
     <section className="bg-white py-12 ">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="md:text-4xl text-xl  font-bold text-gray-800   ">
            Welcome to Rentoora
          </h1>
          <p className="md:w-48 w-28 h-1  md:mt-1 rounded-full bg-red-600 mx-auto md:mb-4 mb-3 "></p>
          <p className="md:text-lg text-gray-600 md:text-center text-justify  leading-relaxed md:max-w-5xl  text-sm ">
            At Rentoora, we aim to provide a seamless experience for renting rooms, 
            houses, and apartments, booking trusted electricians, and buying or selling used phones. 
            We believe in making life easier by offering reliable, convenient, and affordable services to 
            meet your everyday needs.
          </p>
        </div>
      </div>

      {/* Section for services */}
      <div className="relative container text-white mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 py-2 md:rounded-lg  md:w-[85%]  ">
        <div className=" relative flex flex-col items-center border  py-4  rounded-lg  bg-brand-bgColor">
        <div className="absolute  top-[45%] -left-4 w-8 h-8 bg-white   rounded-full "></div>
        <div className="absolute  top-[45%] -right-4 w-8 h-8 bg-white   rounded-full ">
            <div className="md:block hidden absolute w-14 left-[4.5px] top-1 rounded-3xl h-6 bg-brand-bgColor z-10 "></div>
        </div>
            <i class="fa-sharp-duotone fa-solid fa-bookmark absolute  right-4 -top-1.5 text-2xl"></i>
          <img
            src={RoomIcon}
            alt="Rental Services"
            className="h-32 w-48 rounded object-fit mb-4"
          />
          <h3 className="text-2xl font-semibold mb-2">Rentals</h3>
          <p className="text-gray-300 text-center w-[95%]">
            "Browse and book rooms, houses, and apartments that suit your needs. We make
            renting easier and more accessible."
          </p>
        </div>

        <div className="relative flex flex-col items-center border  py-4  rounded-lg  bg-brand-bgColor">
        <div className="absolute  top-[45%] -left-4 w-8 h-8 bg-white   rounded-full "></div>
         <div className="absolute  top-[45%] -right-4 w-8 h-8 bg-white   rounded-full ">
         <div className="md:block hidden absolute w-14 left-[4.5px] top-1 rounded-3xl h-6 bg-brand-bgColor z-10 "></div>
         </div>
            <i class="fa-sharp-duotone fa-solid fa-bookmark absolute  right-4 -top-1.5 text-2xl"></i>
          <img
            src={Electrician}
            alt="Electrician Booking"
            className="h-32 w-48 rounded object-cover mb-4"
          />
          <h3 className="text-2xl font-semibold  mb-2">
            Electrician Booking
          </h3>
          <p className="text-gray-300 text-center w-[95%]">
            "Need help with electrical work? Book our experienced electricians
            with ease and ensure a safe service for your home or business."
          </p>
        </div>

        <div className="relative flex flex-col items-center border  py-4  rounded-lg  bg-brand-bgColor">
        <div className="absolute  top-[45%] -left-4 w-8 h-8 bg-white   rounded-full "></div>
        <div className="absolute  top-[45%] -right-4 w-8 h-8 bg-white   rounded-full "></div>
            <i class="fa-sharp-duotone fa-solid fa-bookmark absolute  right-4 -top-1.5 text-2xl"></i>
          <img
            src={SellPhone}
            alt="Old Phones"
            className="h-32 w-48 rounded object-cover mb-4"
          />
          <h3 className="text-2xl font-semibold mb-2">
            Buy/Sell Old Phones
          </h3>
          <p className="text-gray-300 text-center w-[95%]">
            "Looking to buy or sell a phone? Our platform helps you find the best
            deals on pre-owned phones with transparent transactions."
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="container mx-auto px-6 mt-16 text-center md:w-[85%]">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Why Choose Rentoora?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg shadow-lg">
            <h4 className="text-xl font-semibold text-gray-700 mb-2">Reliable Services</h4>
            <p className="text-gray-600">
              Our platform connects you to verified and reliable providers, ensuring
              quality and peace of mind.
            </p>
          </div>

          <div className="p-6 border rounded-lg shadow-lg">
            <h4 className="text-xl font-semibold text-gray-700 mb-2">Affordable Pricing</h4>
            <p className="text-gray-600">
              We provide cost-effective solutions whether you're renting a property, 
              booking an electrician, or purchasing a phone.
            </p>
          </div>

          <div className="p-6 border rounded-lg shadow-lg">
            <h4 className="text-xl font-semibold text-gray-700 mb-2">Easy-to-Use Platform</h4>
            <p className="text-gray-600">
              Our website is designed to be intuitive and simple, so you can navigate 
              effortlessly and find what you're looking for in no time.
            </p>
          </div>
        </div>
      </div>
    </section>
    <Footer/>
    </>
   
  );
};

export default About;
