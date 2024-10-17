import React from 'react';
import { Home, Wrench, Zap, Phone, Mail, Facebook, Twitter, Instagram, CreditCard } from 'lucide-react';
import Mainlogo from '../assets/img/Main_logo.png';
import Esewa from '../assets/img/esewa-logo.png';
import Khalti from '../assets/img/khalti_wallet.png';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Company Name */}
          <div className="flex flex-col items-center md:items-start">
            <img src={Mainlogo} alt="Company Logo" className="h-8" />
            <p className="text-sm font-bold capitalize">better Way to make life easier with us </p>
          </div>
          
          {/* Services section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li className="flex items-center cursor-pointer hover:text-yellow-700"><Home className="mr-2 h-5 w-5" /> Room Rentals</li>
              <li className="flex items-center cursor-pointer hover:text-yellow-700"><Home className="mr-2 h-5 w-5" /> Home Rentals</li>
              <li className="flex items-center cursor-pointer hover:text-yellow-700"><Home className="mr-2 h-5 w-5" /> Apartment Rentals</li>
              <li className="flex items-center cursor-pointer hover:text-yellow-700"><Wrench className="mr-2 h-5 w-5" /> Plumbing Services</li>
              <li className="flex items-center cursor-pointer hover:text-yellow-700"><Zap className="mr-2 h-5 w-5" /> Electrical Services</li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center"><Phone className="mr-2 h-5 w-5" /> +977-981991223</li>
              <li className="flex items-center"><Mail className="mr-2 h-5 w-5" /> bhishansah@Rentoora.com</li>
              <li> Near Durga-Mandir Lahan, Siraha, Madhesh Pradesh, 431704</li>
            </ul>
          </div>
          
          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400"><Facebook className="h-6 w-6" /></a>
              <a href="#" className="hover:text-blue-400"><Twitter className="h-6 w-6" /></a>
              <a href="#" className="hover:text-pink-400"><Instagram className="h-6 w-6" /></a>
            </div>
          </div>

          {/* Payment Partners */}
          <div >
            <h3 className="text-lg font-semibold mb-4">Payment Partners</h3>
            <ul className="space-y-2">
              <li className="flex items-center"><CreditCard className="mr-2 h-5 w-5" /> Visa Card</li>
              <li className="flex items-center"><img src={Esewa} className=" mr-2 w-5 h-5"/> eSewa</li>
              <li className="flex items-center"><img src={Khalti} className="mr-2 h-5 w-5" /> Khalti</li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="md:mt-8 mt-6  pt-4  border-t border-gray-700 text-center">
          <p className=" text-sm md:text-xl">&copy; {new Date().getFullYear()} Copyright to Vision Technology. All Right Resolved ! </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;