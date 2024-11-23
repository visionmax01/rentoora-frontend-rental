import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import RoomIcon from "../../assets/img/rent-img.avif";
import PlumberIcon from "../../assets/img/plumber.jpg";
import Electrician from "../../assets/img/electrician1.jpg";
import phoneIMG from "../../assets/img/buy_sell-phone.jpg";

const Services = () => {
  const navigate = useNavigate();

  const handleNavigate = (route) => {
    navigate(route);
  };

  return (
    <div className="text-black flex flex-col items-center uppercase md:rounded-none md:text-lg font-bold text-[12px] p-6 my-4 w-full bg-gradient-to-r from-gray-700 to-blue-950 bluer-500">
      <div>
        <h1 className="md:text-3xl text-xl text-white opacity-75 mb-4 uppercase font-extrabold">
          Services We Provide
        </h1>
      </div>
      <div className="flex gap-4 justify-around items-center flex-wrap md:justify-center md:gap-16">
        {/* Rent Room */}
        <motion.div
          className="relative flex justify-center hover:border-red-600 border-2 flex-col items-center w-full lg:w-[400px] bg-white rounded-lg shadow-lg hover:shadow-2xl"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          viewport={{ once: true }} 
        >
          <img
            src={RoomIcon}
            className="h-52 lg:h-64 w-full rounded-lg z-10 relative"
            alt="Rent Room"
          />
          <p className="text-xl text-center pt-2 font-semibold text-gray-800">
            Rent Room / Apartment / Houses
          </p>
          <button
            onClick={() => handleNavigate("/rental-service")}
            className="px-4 py-2 my-4 w-3/4 text-white text-xl bg-blue-500 hover:bg-blue-600 rounded transform-width duration-300 hover:ease-in-out"
          >
            Explore
          </button>
        </motion.div>

        {/* Electrician / Plumber */}
        <motion.div
          className="relative flex justify-center hover:border-red-600 border-2 flex-col items-center w-full lg:w-[400px] bg-white rounded-lg shadow-lg hover:shadow-2xl"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex">
            <img
              src={Electrician}
              className="rounded-t-lg h-52 lg:h-64 w-1/2 object-fit"
              alt="Electrician"
            />
            <img
              src={PlumberIcon}
              className="rounded-t-lg h-52 lg:h-64 w-1/2 object-cover"
              alt="Plumber"
            />
          </div>
          <p className="text-center text-xl pt-2">Electrician / Plumber</p>
          <button
            onClick={() => handleNavigate("/services-booking-system")}
            className="px-4 py-2 my-4 w-3/4 text-white text-xl bg-blue-500 hover:bg-blue-600 rounded transform-width duration-300 hover:ease-in-out"
          >
            Explore
          </button>
        </motion.div>

        {/* Sell Your Phone */}
        <motion.div
          className="relative flex justify-center hover:border-red-600 border-2 flex-col items-center w-full lg:w-[400px] bg-white rounded-lg shadow-lg hover:shadow-2xl"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <img
            src={phoneIMG}
            className="rounded-t-lg w-full h-52 lg:h-64 object-cover"
            alt="Sell Your Phone"
          />
          <p className="text-xl text-center pt-2">Sell your Phone</p>
          <button
            onClick={() => handleNavigate("/buy-electronic")}
            className="px-4 py-2 my-4 w-3/4 text-white text-xl bg-blue-500 hover:bg-blue-600 transform-width duration-300 hover:ease-in-out rounded"
          >
            Explore
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;
