import React, { useState, useEffect } from 'react';
import { Home, Wrench, Zap, Phone, Mail, Facebook, Twitter, Instagram, CreditCard, Star } from 'lucide-react';
import Mainlogo from '../assets/img/Main_logo.png';
import Esewa from '../assets/img/esewa-logo.png';
import Khalti from '../assets/img/khalti_wallet.png';
import Api from '../utils/Api.js';

const Footer = () => {
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await Api.get('/count/average-rating');
        setAverageRating(response.data.averageRating || 0);
      } catch (error) {
        console.error('Error fetching rating:', error);
      }
    };
    fetchRating();
  }, []);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < Math.round(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-400'
        }`}
      />
    ));
  };

  return (
    <footer className="bg-gray-800 text-white pt-8 lg:px-8">
      <div className="container mx-auto px-4">
        {/* Logo and Company Name */}
        <div className="flex flex-col items-center md:items-start mb-4">
            <img src={Mainlogo} className="lg:-ml-1.5 h-10" alt="Company Logo" />
            <p className="text-sm font-bold capitalize">better Way to make Daily life easier with us </p>
          <div className="col-span-full my-4  flex flex-col items-center">
            <div className="flex items-center gap-2">
              {renderStars(averageRating)}
              <span className="ml-2">({averageRating.toFixed(1)})</span>
            </div>
          </div>
          </div>
          <hr className='py-2 opacity-25'/>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-16"> 
          {/* Services section */}
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Our Services</h3>
            <ul className="space-y-2 ">
              <li className="flex items-center cursor-pointer hover:text-yellow-400"><Home className="mr-2 h-5 w-5" />Rentals Services</li>
              <li className="flex items-center cursor-pointer hover:text-yellow-400"><Wrench className="mr-2 h-5 w-5" /> Plumbing Services</li>
              <li className="flex items-center cursor-pointer hover:text-yellow-400"><Zap className="mr-2 h-5 w-5" /> Electrical Services</li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center"><Phone className="mr-2 h-5 w-5" /> +977-981991223</li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=rentoora@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-yellow-400"
                >   
                  rentoora@gmail.com
                </a>
              </li>


              <li> Near Durga-Mandir Lahan, Siraha, Madhesh Pradesh, 431704</li>
            </ul>
          </div>
          
          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400"><Facebook className="h-6 w-6" /></a>
              <a href="#" className="hover:text-blue-400"><Twitter className="h-6 w-6" /></a>
              <a href="#" className="hover:text-pink-400"><Instagram className="h-6 w-6" /></a>
            </div>
          </div>

          {/* Payment Partners */}
          <div >
            <h3 className="text-lg font-semibold mb-4 text-white">Payment Partners</h3>
            <ul className="space-y-2">
              <li className="flex items-center"><CreditCard className="mr-2 h-5 w-5" /> Visa Card</li>
              <li className="flex items-center"><img src={Esewa} className=" mr-2 w-5 h-5"/> eSewa</li>
              <li className="flex items-center"><img src={Khalti} className="mr-2 h-5 w-5" /> Khalti</li>
            </ul>
          </div>
        </div>
        <hr className="mt-4 opacity-25" />
        {/* Copyright */}
        <div className="py-4 text-center">
          <p className=" text-[12px] lg:text-lg">&copy; {new Date().getFullYear()} Copyright to Bhishan Technology. All Right Resolved ! </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;