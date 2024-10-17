import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import MyPic from '../../assets/img/my_profile_pic.jpg'
import MyPic2 from '../../assets/img/shiv.png'

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
    { id: 1, image:MyPic, title: 'Bhishan', content: 'Hellow my name is Bhishan sah And iam from Nepal ' },
    { id: 2, image:MyPic2, title: 'SHIV RAJ RAUT', content: 'Content for Card 2' },
    { id: 3, image:MyPic, title: 'Bhishan 3', content: 'Content for Card 3' },
    { id: 4, image:MyPic2, title: 'SHIV RAJ RAUT', content: 'Content for Card 4' },
    { id: 5, image:MyPic, title: 'Bhishan 5', content: 'Content for Card 5' },
    { id: 6, image:MyPic2, title: 'SHIV RAJ RAUT', content: 'Content for Card 6' },
    { id: 7, image:MyPic, title: 'Bhishan 7', content: 'Content for Card 7' },
  ];

  return (
    <div className="  md:w-[85%] md:mx-auto rounded-lg relative ">
    
        <div className="md:w-[95%] w-full    mx-auto   md:bg-opacity-15 rounded-lg md:px-2 ">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-4 md:space-x-8 p-4 no-scrollbar rounded-lg"
        onScroll={handleScroll}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex-shrink-0  w-40   h-64  md:w-60 md:h-70 bg-white  rounded-lg shadow-md p-4 flex flex-col items-center"
          >
            <img src={card.image} className="w-32 h-24 bg-blue-400  object-cover object-top rounded-3xl" alt="User Image" srcset="" />
            <h3 className="md:text-lg py-2 font-bold text-lg ">{card.title}</h3>
            <p className='text-center text-[15px]'>{card.content}</p>
          </div>
        ))}
      </div>
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="text-white  hidden md:block absolute -left-5 top-1/2 transform -translate-y-1/2 bg-brand-bgColor rounded-full p-2 shadow-md hover:bg-blue-500"
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