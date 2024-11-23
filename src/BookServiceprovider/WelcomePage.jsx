import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LOGO from '../assets/img/Main_logo.png'

const WelcomePage = () => {
  const navigate = useNavigate();
  const HomePageRedirection = () => {
    navigate('/');
  };  
  return (
    <>
      <div className="h-screen lg:overflow-hidden overflow-y-auto bg-gradient-to-r  from-brand-bgColor via-brand-dark to-brand-Colorpurple relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          <img onClick={HomePageRedirection} className="z-50 flex items-center gap-2 absolute top-3 left-5 w-[150px]  h-12 cursor-pointer" src={LOGO} alt="" />
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-yellow-300 to-transparent opacity-20 transform -skew-y-6"></div>
        <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-t from-blue-300 to-transparent opacity-20 transform skew-y-6"></div>
        
        <div className="relative flex flex-col items-center justify-center px-4 pt-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-4xl font-bold mb-8 text-white animate-fade-in drop-shadow-lg">
              Welcome to Our Service Booking !
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-white leading-relaxed drop-shadow-md">
              Discover seamless service booking at your fingertips. Book trusted professionals for home services, repairs, maintenance and more. Fast, reliable, and hassle-free!
            </p>
            <Link
              to={'/sb-form'}
              className="inline-block px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-purple-800 text-xl font-semibold rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Start Booking Now!
            </Link>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6 bg-white bg-opacity-90 rounded-xl shadow-md hover:shadow-lg transition-shadow transform ">
              <div className="text-purple-600 text-3xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold mb-2">Easy Search</h3>
              <p className="text-gray-700">Find the perfect service provider in seconds</p>
            </div>
            
            <div className="p-6 bg-white bg-opacity-90 rounded-xl shadow-md hover:shadow-lg transition-shadow transform ">
              <div className="text-purple-600 text-3xl mb-4">🎊</div>
              <h3 className="text-xl font-semibold mb-2">Quick Booking</h3>
              <p className="text-gray-700">Book appointments with just a few clicks</p>
            </div>
            
            <div className="p-6 bg-white bg-opacity-90 rounded-xl shadow-md hover:shadow-lg transition-shadow transform ">
              <div className="text-purple-600 text-3xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold mb-2">Quality Service</h3>
              <p className="text-gray-700">Verified professionals at your service</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomePage;
