"use client";
import { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LikeButton({ blogId, likes, likedBy }) {
  const { data: session } = useSession();
  const router = useRouter();
  const userId = session?.user?.id;
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(likes);

  useEffect(() => {
    if (userId && likedBy) {
      const userLiked = likedBy.some((entry) => entry.userId === userId);
      setLiked(userLiked);
    }
  }, [likedBy, userId]);

  const toggleLike = async () => {
    if (!userId) {
      // 🔁 Redirect to auth page if user not logged in
      router.push("/auth");
      return;
    }

    const newLiked = !liked;
    setLiked(newLiked);
    setCount((prev) => (newLiked ? prev + 1 : prev - 1));

    try {
      await axios.post(
        `https://dashboard-blog.vercel.app/api/blogPost/${blogId}/likes`,
        {
          userId,
        }
      );
    } catch (error) {
      console.error(
        "Like toggle failed:",
        error.response?.data || error.message
      );
      setLiked(!newLiked);
      setCount((prev) => (newLiked ? prev - 1 : prev + 1));
    }
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
