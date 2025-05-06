"use client";

import { useState } from "react";
import { FaHeart } from "react-icons/fa";

export default function LikeButton() {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(124); // Replace with actual like count from DB

  const toggleLike = () => {
    setLiked(!liked);
    setCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <button
      onClick={toggleLike}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition ${
        liked ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
      } hover:scale-105`}
    >
      <FaHeart className={liked ? "text-red-500" : "text-gray-400"} />
      {count} Like{count !== 1 ? "s" : ""}
    </button>
  );
}
