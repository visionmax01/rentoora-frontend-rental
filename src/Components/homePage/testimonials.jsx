import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import MyPic from '../../assets/img/my_profile_pic.jpg'
import MyPic2 from '../../assets/img/shiv.png'
import Ravi from '../../assets/img/Ravi_shankar_img.jpg'
import Sihalpic from '../../assets/img/sahilpic.jpg'
import MyPic3 from '../../assets/img/man.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft, faQuoteRight } from '@fortawesome/free-solid-svg-icons';

const Testimonials = () => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    const { current } = scrollRef;
    if (current) {
      setShowLeftArrow(current.scrollLeft > 0);
      setShowRightArrow(
        current.scrollLeft < current.scrollWidth - current.clientWidth
      );
    }
  };

  // Sample card data
  const cards = [
    { id: 1, image: MyPic, name: 'Bhishan prasad sah', content: 'A convenient solution for renting homes, booking plumbers or electricians, and selling old phones. Quick, reliable, and easy to use' },
    { id: 2, image: MyPic2, name: 'Shiv raj raut', content: 'I rented an apartment, booked an electrician, and sold my phone all in one place. Highly recommend this service' },
    { id: 3, image: Ravi, name: 'Ravi shankar Prasad Singh', content: 'A hassle-free experience renting houses and booking services like electricians. Also sold my phone quickly. Loved it' },
    { id: 4, image: Sihalpic, name: 'Sahil kumar sah', content: 'This site is perfect for renting, booking household repairs, and selling phones. Fast, efficient, and user-friendly.' },
    { id: 5, image: MyPic3, name: 'Anrud kumar sah', content: 'Found a perfect room, hired a plumber, and sold my phone easily. Great service with everything in one place' },
    { id: 6, image: MyPic3, name: 'Ranjit kumar sah', content: 'Excellent platform for renting houses, booking home services, and selling old phones. Super fast and convenient for everything' },
    { id: 7, image: MyPic3, name: 'Manoj kumar sah', content: 'An all-in-one solution for renting homes, booking electricians and plumbers, and selling old phones. Fast, efficient, and super easy to use' },
  ];

  return (
    <div className="md:w-[85%] md:mx-auto rounded-lg relative">
      <div className="md:w-[95%] w-full mx-auto md:bg-opacity-15 rounded-lg md:px-2">
        <h1 className="text-center capitalize text-2xl">testimonial's</h1>
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-6 md:space-x-8 p-6 no-scrollbar rounded-lg"
          onScroll={handleScroll}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className="flex-shrink-0 bg-brand-light bg-opacity-25 lg:w-80 w-[85%] h-auto md:w-60 md:h-70 rounded-lg shadow-md p-4 flex flex-col "
            >

              <img
                src={card.image}
                className="w-12 h-12 bg-blue-400 object-cover object-top rounded"
                alt="User Image"
              />
              <h3 className="md:text-lg py-2 text-brand-white font-bold text-lg">{card.name}</h3>
              <hr className='mb-2 border-[1px] border-brand-dark ' />
              <p className='lg:text-[15px] text-[12px] text-gray-400 text-justify'>
                <FontAwesomeIcon icon={faQuoteLeft} style={{ marginRight: '8px', color:'white' }} />
                {card.content}
                <FontAwesomeIcon icon={faQuoteRight} style={{ marginLeft: '5px', color:'white' }} />
                 </p>
            </div>
          ))}
        </div>
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="text-white hidden md:block absolute -left-5 top-1/2 transform -translate-y-1/2 bg-brand-bgColor rounded-full p-2 shadow-md hover:bg-blue-500"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="text-white hidden md:block absolute -right-5 top-1/2 transform -translate-y-1/2 bg-brand-bgColor rounded-full p-2 shadow-md hover:bg-blue-500"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Testimonials;
