// src/components/FlipCard.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function FlipCard({ data }) {
  const navigate = useNavigate();
  
  return (
    <div
      className="flip-card w-full h-96 rounded-xl shadow-md bg-transparent cursor-pointer"
      tabIndex={0}
    >
      <div className="flip-card-inner w-full h-full rounded-xl">
        {/* Front Side */}
        <div className="flip-card-front w-full h-full rounded-xl bg-white flex flex-col">
          <div className="h-48 overflow-hidden rounded-t-xl">
            <img
              src={data.img}
              alt={data.name}
              draggable={false}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 flex items-center justify-center px-4">
            <div>
              <h3 className="font-bold text-lg mt-4 text-center">{data.name}</h3>
            </div>
          </div>
        </div>
        {/* Back Side */}
        <div className="flip-card-back w-full h-full rounded-xl bg-white border flex flex-col justify-between p-6">
          <div>
            <h4 className="font-bold text-lg mb-2">Course Overview</h4>
            <p className="text-gray-500 text-sm mb-3 line-clamp-3">{data.desc}</p>
            <h3 className="font-semibold">{data.name}</h3>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => navigate(data.url)}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[#1b1c1e] text-white rounded-md font-semibold hover:bg-black transition shadow"
            >
              Learn More
              <span className="ml-1">
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M5 3l5 5-5 5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
