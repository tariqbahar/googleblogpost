"use client";

import { useEffect, useRef } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

function BlogPostViewTracker({ blogId }) {
  const { data: session, status } = useSession();
  const currentUserId = session?.user?.id;

  const timerRef = useRef(null);

  const hasSentViewRequestRef = useRef(false);

  useEffect(() => {
    // Cleanup function: Clear any existing timer if the component unmounts
    // or if the blogId changes (e.g., user navigates to another blog post)
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [blogId]); // Depend on blogId to reset the timer if the post changes

  useEffect(() => {
    // 1. Prevent multiple requests: If already sent for this mount, or no blogId, exit.
    if (!blogId || hasSentViewRequestRef.current) {
      return;
    }

    // 2. Wait for session to load: Don't proceed if authentication status is still loading.
    if (status === "loading") {
      return;
    }

    // 3. Require authentication: If user is not authenticated or currentUserId is missing, do not track.
    if (status !== "authenticated" || !currentUserId) {
      console.log("User not authenticated, skipping view tracking.");
      return;
    }

    // Function to send the view update request to the backend
    const postView = async () => {
      try {
        const response = await axios.post(
          `https://dashboard-blog.vercel.app/api/blogPost/${blogId}/views`,
          {
            userId: currentUserId, // Send the logged-in user's ID
          }
        );
        console.log("View API response:", response.data.message);
        hasSentViewRequestRef.current = true; // Mark request as sent for this session load
      } catch (error) {
        // Log detailed error from backend if available
        console.error(
          "Error posting view:",
          error.response?.data?.error || error.message
        );
        if (error.response?.status === 401) {
          console.warn("View not registered: Server required login.");
        }
      }
    };

    // Set a timer to call the `postView` function after 1 minute (60,000 milliseconds)
    // This ensures the user has spent at least the required time on the page.
    timerRef.current = setTimeout(postView, 60 * 1000); // 1 minute

    // Cleanup function for when the component unmounts or dependencies change before the timer fires
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [blogId, currentUserId, status]); // Dependencies: Re-run if blogId, userId, or auth status changes

  return null; // This component does not render any visible UI
}

export default BlogPostViewTracker;
