import React from "react";

const StarRating = ({ rating, maxStars = 5, size = "text-sm" }) => {
  return (
    <div className={`flex items-center text-yellow-500 gap-0.5 ${size}`}>
      {[...Array(maxStars)].map((_, i) => (
        <span key={i}>{i < Math.floor(rating || 0) ? "★" : "☆"}</span>
      ))}
    </div>
  );
};

export default StarRating;
