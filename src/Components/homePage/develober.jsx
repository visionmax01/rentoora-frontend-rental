import React from "react";
import BhishanImage from "../../assets/img/my_profile_pic.jpg";
import SecondDevImage from "../../assets/img/shiv.jpg";
import NavBar from "../NavBar";
import backgroundImage from "../../assets/img/design1.png";
const Developer = () => {
  const developers = [
    {
      name: "BHISHAN PR. SAH",
      title: "Computer Engineer",
      role: "Full Stack Web Developer",
      mobile: "+91 9728161275",
      nepalino: "+977 9819931223",
      email: "bhishansah@gmail.com",
      website: "https://www.bhishansah.com.np",
      websitename:"bhishansah.com.np",
      image: BhishanImage,
      socialLinks: {
        facebook: "https://www.facebook.com/share/qJntLSmzjo3uB8HV/?mibextid=qi2Omg",
        whatsapp: "https://wa.me/919728161275?text=Hello!%20How%20are%20you.",
        linkedin: "https://www.linkedin.com/in/bhishansah/",
        github: "https://github.com/visionmax01/",
      },
    },
    {
      name: "SHIV RAJ RAUT",
      title: "Computer Engineer",
      role: "Frontend Developer",
      mobile: "+91- not available",
      nepalino: "+977 9819931223",
      email: "sraut683@rku.ac.in",
      website: "https://www.shivrajraut.com.np",
      websitename:"shivrajraut.com.np",
      image: SecondDevImage,
      socialLinks: {
        facebook: "https://www.facebook.com/shiv.raja.9404",
        whatsapp: "https://wa.me/9779825823297?text=Welcome%20to%20Shiv%20Raj%20account",
        linkedin: "https://www.linkedin.com/in/shiv-raut-73aa11254/",
        github: "https://www.linkedin.com/in/bhishansah/",
      },
    },
  ];

  return (
    <div className="md:h-screen bg-contain bg-top bg-fixed bg-gray-50 " style={{ backgroundImage: `url(${backgroundImage})` }}>
      <NavBar />
      <div className="flex flex-col items-center p-8">
        <h1 className="md:text-4xl text-2xl text-black font-bold mb-8">
          Meet Our Developers
          <p className="md:w-48 w-32 h-1 md:mt-1 rounded-full bg-red-600 mx-auto"></p>
        </h1>
        <div className="w-full relative flex justify-center flex-wrap gap-14">
          {developers.map((dev, index) => (
            <div
              key={index}
              className="w-[95%] md:w-72 bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
            >
              <i className="fa-sharp-duotone fa-solid fa-bookmark absolute right-4 -top-1.5 text-4xl text-white"></i>
              <img
                src={dev.image}
                alt={`${dev.name}`}
                className="w-full h-60 md:object-fit md:object-top object-fill"
              />
              <div className=" w-full flex justify-between ">
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {dev.name}
                  </h2>
                  <p className="text-sm text-gray-600">{dev.title}</p>
                  <p className="text-sm text-gray-600 mb-4">{dev.role}</p>
                  <p className="text-sm text-gray-800 mb-2">
                    <strong>Indian No:</strong> {dev.mobile}
                  </p>
                  <p className="text-sm text-gray-800 mb-2">
                    <strong>Nepali No:</strong> {dev.nepalino}
                  </p>
                  <p className="text-sm text-gray-800">
                    <strong>Email:</strong> {dev.email}
                  </p>
                  <div className="mt-2">
                    <strong>Website : </strong>
                  <a
                    href={dev.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" text-red-700 hover:text-brand-dark rounded text-sm"
                  >
                   <i class="fa-solid fa-globe"></i>&nbsp;{dev.websitename}
                  </a>
                  </div>
                </div>
                <div className="px-2 bg-gray-200 py-4 flex items-end justify-end flex-col space-y-4">
                <a
                    href={dev.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-700 text-brand-lightdark"
                  >
                    <i className="fa-brands fa-square-github md:text-2xl text-[1.7rem] hover:text-brand-Colorpurple text-black "></i>
                  </a>
                  <a
                    href={dev.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-700 text-brand-lightdark"
                  >
                    <i className="fa-brands fa-square-facebook md:text-2xl text-[1.7rem] hover:text-blue-700"></i>
                  </a>
                  <a
                    href={dev.socialLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-green-400 text-green-600"
                  >
                    <i className="fa-brands fa-square-whatsapp md:text-2xl text-[1.7rem] hover:text-green-700"></i>
                  </a>
                  <a
                    href={dev.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-300 text-blue-900"
                  >
                    <i className="fa-brands fa-linkedin md:text-2xl text-[1.7rem] hover:text-blue-700"></i>
                  </a>
                  
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Developer;
