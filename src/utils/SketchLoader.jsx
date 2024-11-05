import React from "react";
import Skeleton from "react-loading-skeleton";

const SketchLoader = () => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <Skeleton height={40} width={200} />
      <div className="flex flex-wrap justify-center">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="transform h-fit transition duration-300 hover:scale-105 w-[325px] border border-gray-300 relative rounded-lg shadow-lg overflow-hidden group mb-4"
          >
            <div className="relative">
              <Skeleton height={150} className="w-full" />
              <h2 className="text-2xl w-full font-bold absolute top-0 left-0 uppercase text-brand-white pt-1 text-center bg-yellow-600 opacity-75">
                Loading...
              </h2>
            </div>
            <div className="py-2 px-4">
              <Skeleton height={20} width={`70%`} />
              <Skeleton height={20} width={`50%`} className="mt-2" />
              <Skeleton height={20} width={`40%`} className="mt-2" />
              <Skeleton height={40} width={`100%`} className="mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SketchLoader;
