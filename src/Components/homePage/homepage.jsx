import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar";
import { Locate, Search } from "lucide-react";
import Apartment from "../../assets/img/apartment.png";
import PlumberIcon from "../../assets/img/plumber.png";
import Electrician from "../../assets/img/electrician.png";
import "./style.css";
import Footer from "../Footer";
import Services from "./services";
import Testimonials from "./testimonials";

const Homepage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    if (searchTerm) {
      navigate(`/Search/${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="relative text-white bg-brand-bgColor">
      <NavBar />
      <div className="mt-10 md:mt-20">
        <div className="h-96 bg-white opacity-5 absolute top-0 w-full -z-10"></div>
        <div className="relative w-full mx-auto text-center opacity-80">
          <p className="text-center text-4xl font-Roboto opacity-75">Search for Place</p>
          <h2 className="text-md mt-4 md:text-2xl">
            An intelligent and effortless way to find{" "}
            <span className="uppercase text-red-200 text-2xl md:text-4xl">
              rooms, apartments, houses
            </span>{" "}
            or any rental property for you!
          </h2>
        </div>
        <div className="mx-auto flex flex-col items-center justify-center">
          <div className="w-full flex flex-col h-64 rounded-lg relative">
            <div className="obsolute flex justify-center w-full z-20">
              <div className="max-w-fi py-4">
                <div className="searchBox bg-white bg-opacity-10 flex justify-between items-center p-2 gap-2 rounded-lg">
                  <Locate className="relative opacity-70 w-5 h-5" />
                  <input
                    className="text-white font-sans text-xl border-none outline-none w-62 md:w-96 py-1 bg-transparent"
                    type="text"
                    value={searchTerm}
                    onChange={handleChange}
                    placeholder="Enter location..."
                  />
                  <button
                    type="button"
                    className="bg-brand-light hover:bg-brand-dark bg-opacity-45 py-2 px-2 rounded-md"
                    onClick={handleSearch}
                  >
                    <Search />
                  </button>
                </div>
              </div>
            </div>
            <div>
              <Services />
            </div>
          </div>
        </div>
      </div>
      <div className="text-white relative pb-8 top-4 md:mt-28 mt-[350px] text-start opacity-85">
        <p className="text-4xl text-center font-extrabold space-x-4"></p>
        <p className="text-sm md:text-2xl w-[90%] md:w-3/4 mx-auto text-wrap break-words text-center capitalize">
          Service to make people's life easier and smart with technology. You can
          get your rented house, apartment, or room for student or family need in
          different areas of Nepal.
        </p>
      </div>
      <section className="relative mb-5 border-t-4 border-gray-800 mt-5">
        <div className="md:block hidden opacity-25 torch w-8 h-8 rounded-full absolute right-5 top-5 bg-black bg-opacity-50 border-l-4 border-white -rotate-45"></div>
        <div className="md:block hidden opacity-25 torch w-8 h-8 rounded-full absolute left-5 top-5 bg-black bg-opacity-50 border-l-4 border-white -rotate-[120deg]"></div>
        <div className="text-white w-full md:w-[75%] mx-auto min-h-fit flex flex-wrap md:rounded-lg px-8 py-8">
          <div className="w-[60%] relative md:top-12 break-words">
            <h1 className="md:text-[3rem] text-2xl font-Roboto">Plumber</h1>
            <p className="md:text-2xl text-sm mt-2 md:mt-5">
              You can find the best plumber for your home bathroom, kitchen, tap, etc. Fitting at your fingertips.
            </p>
          </div>
          <div className="w-[40%] flex h-auto items-center justify-center">
            <img
             srcSet=""
              className="glowShadow object-cover md:w-60 md:h-60 opacity-80"
              src={PlumberIcon}
              alt="Plumber Icon"
            />
          </div>
        </div>
      </section>
      <section className="mb-5 border-t-4 border-gray-800 mt-5">
        <div className="relative text-White w-full md:w-[75%] mx-auto min-h-fit flex flex-wrap md:rounded-lg px-8 py-8">
          <div className="w-[40%] flex h-auto justify-between pr-6">
            <img
            srcSet=""
              className="glowShadow object-cover md:w-60 md:h-60 opacity-80"
              src={Electrician}
              alt="Electrician Icon"
            />
          </div>
          <div className="w-[60%] relative md:top-12 break-words">
            <h1 className="md:text-[3rem] text-2xl font-Roboto">Electrician</h1>
            <p className="md:text-2xl text-sm mt-2 md:mt-5">
              You can find the best electrician for your home building anywhere at your fingertips.
            </p>
          </div>
        </div>
      </section>
      <section className="relative mb-5 border-t-4 border-b-4 border-gray-800 mt-5">
        <div className="text-white w-full md:w-[75%] mx-auto min-h-fit flex flex-wrap md:rounded-lg px-8 py-8">
          <div className="w-[60%] relative md:top-12 break-words">
            <h1 className="md:text-[3rem] text-2xl font-Roboto">Apartment</h1>
            <p className="md:text-2xl text-sm mt-2 md:mt-5">
              You can find the best apartment for your family to stay at your fingertips.
            </p>
          </div>
          <div className="w-[40%] flex h-auto items-center justify-center">
            <img
            srcSet=""
              className="glowShadow object-cover md:w-60 md:h-60 opacity-80"
              src={Apartment}
              alt="Apartment Icon"
            />
          </div>
        </div>
      </section>
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Homepage;
