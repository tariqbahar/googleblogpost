// CommentSection.jsx
"use client";
import { useEffect, useState, startTransition } from "react";
import ConfirmDialog from "../ConfirmDialog";
import Comment from "./Comment";
import axios from "axios";
import { useSession } from "next-auth/react"; // Uncomment this line

export default function CommentSection({ blog }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState(null);
  const [parentIdToDelete, setParentIdToDelete] = useState(null);
  const [deleteLevel, setDeleteLevel] = useState(0);
  const [isPosting, setIsPosting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const { data: session } = useSession(); // Use useSession to get user data
  const currentUser = session?.user; // Get the logged-in user object
  const currentUserId = currentUser?.id; // Get the logged-in user's ID

  const fetchComments = async (showLoader = true) => {
    if (showLoader) setLoading(true);

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogPost/${blog._id}/comments`
      );
      // Ensure the comments array is always an array
      setComments(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching comments", error);
      setComments([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [blog._id]);

  const postComment = async () => {
    if (!message.trim() || !currentUserId) return; // Ensure user is logged in
    setIsPosting(true);

    const tempId = Date.now().toString();
    const newComment = {
      _id: tempId,
      message,
      userId: currentUserId, // Use actual current user ID
      user: currentUser?.name || "Anonymous", // Use actual current user name
      replies: [],
      likes: [],
      createdAt: new Date().toISOString(),
    };

    startTransition(() => {
      setComments((prev) => [...prev, newComment]);
      setMessage("");
    });

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogPost/${blog._id}/comments`,
        {
          blogId: blog._id,
          userId: currentUserId,
          message,
        }
      );
      await fetchComments(false);
    } catch (err) {
      console.error("Error posting comment", err);
      setComments((prev) => prev.filter((c) => c._id !== tempId));
    } finally {
      setIsPosting(false);
    }
  };

  const postReply = async (parentId, text) => {
    if (!text.trim() || !currentUserId) return; // Ensure user is logged in
    setIsReplying(true);

    const tempId = Date.now().toString();
    const newReply = {
      _id: tempId,
      message: text,
      userId: currentUserId, // Use actual current user ID
      user: currentUser?.name || "Anonymous", // Use actual current user name
      createdAt: new Date().toISOString(),
      likes: [],
    };

    startTransition(() => {
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === parentId
            ? {
                ...comment,
                replies: [...(comment.replies || []), newReply],
              }
            : comment
        )
      );
      setReplyText("");
      setReplyingTo(null);
    });

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogPost/${blog._id}/comments/${parentId}/replies`,
        {
          blogId: blog._id,
          userId: currentUserId,
          message: text,
        }
      );
      await fetchComments(false);
    } catch (err) {
      console.error("Error posting reply", err);
      // Optionally roll back the reply if the backend call fails
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === parentId
            ? {
                ...comment,
                replies: (comment.replies || []).filter(
                  (reply) => reply._id !== tempId
                ),
              }
            : comment
        )
      );
    } finally {
      setIsReplying(false);
    }
  };

  const editComment = async (id, newText) => {
    if (!newText.trim() || !currentUserId) return; // Ensure user is logged in

    // Find the comment to check if the current user is the author (frontend check)
    const commentToEdit = comments.find((c) => c._id === id);
    if (!commentToEdit || commentToEdit.userId !== currentUserId) {
      console.warn("Unauthorized attempt to edit comment.");
      // You might want to show a toast/notification here
      return;
    }

    startTransition(() => {
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === id ? { ...comment, message: newText } : comment
        )
      );
      setEditingCommentId(null);
      setEditText("");
    });

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogPost/${blog._id}/comments/${id}`,
        {
          message: newText,
        }
      );
      fetchComments(false);
    } catch (err) {
      console.error("Error editing comment", err);
      // Roll back optimistic update on error
      await fetchComments(true); // Force a full re-fetch to revert changes
    }
  };

  const editReply = async (parentId, replyId, newText) => {
    if (!newText.trim() || !currentUserId) return; // Ensure user is logged in

    // Find the reply to check if the current user is the author (frontend check)
    const parentComment = comments.find((c) => c._id === parentId);
    const replyToEdit = parentComment?.replies.find((r) => r._id === replyId);
    if (!replyToEdit || replyToEdit.userId !== currentUserId) {
      console.warn("Unauthorized attempt to edit reply.");
      return;
    }

    startTransition(() => {
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment._id === parentId) {
            const updatedReplies = comment.replies.map((reply) =>
              reply._id === replyId ? { ...reply, message: newText } : reply
            );
            return { ...comment, replies: updatedReplies };
          }
          return comment;
        })
      );
      setEditingCommentId(null);
      setEditText("");
    });

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogPost/${blog._id}/comments/${parentId}/replies/${replyId}`,
        { message: newText }
      );
      fetchComments(false);
    } catch (err) {
      console.error("Error editing reply", err);
      await fetchComments(true); // Force a full re-fetch to revert changes
    }
  };

  const toggleLike = async (id) => {
    if (!currentUserId) {
      alert("You must be logged in to like comments."); // Or use a proper notification
      return;
    }

    // Optimistic toggle
    startTransition(() => {
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment._id === id) {
            const hasLiked = comment.likes.includes(currentUserId);
            const newLikes = hasLiked
              ? comment.likes.filter((uid) => uid !== currentUserId)
              : [...comment.likes, currentUserId];
            return { ...comment, likes: newLikes };
          }

          if (comment.replies?.length) {
            const updatedReplies = comment.replies.map((reply) => {
              if (reply._id === id) {
                const hasLiked = reply.likes.includes(currentUserId);
                const newLikes = hasLiked
                  ? reply.likes.filter((uid) => uid !== currentUserId)
                  : [...reply.likes, currentUserId];
                return { ...reply, likes: newLikes };
              }
              return reply;
            });
            return { ...comment, replies: updatedReplies };
          }
          return comment;
        })
      );
    });

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogPost/${blog._id}/comments/${id}/toggleLike`, // Changed endpoint for clarity
        { userId: currentUserId }
      );
      fetchComments(false); // Sync
    } catch (err) {
      console.error("Error toggling like", err);
      await fetchComments(true); // Revert optimistic change on error
    }
  };

  const handleDeleteRequest = (id, level, parentId = null) => {
    // Frontend check for authorization before even showing the confirmation
    let isAuthorizedToDelete = false;
    if (level === 0) {
      const comment = comments.find((c) => c._id === id);
      isAuthorizedToDelete = comment && comment.userId === currentUserId;
    } else {
      const parentComment = comments.find((c) => c._id === parentId);
      const reply = parentComment?.replies.find((r) => r._id === id);
      isAuthorizedToDelete = reply && reply.userId === currentUserId;
    }

    if (isAuthorizedToDelete) {
      setCommentIdToDelete(id);
      setParentIdToDelete(parentId);
      setDeleteLevel(level);
      setDeleteConfirmationOpen(true);
    } else {
      alert("You are not authorized to delete this comment/reply."); // Or use a proper notification
    }
  };

  const handleDeleteConfirm = async () => {
    if (!currentUserId) {
      alert("You must be logged in to delete comments.");
      setDeleteConfirmationOpen(false);
      return;
    }

    // Optimistic UI update
    startTransition(() => {
      setComments((prevComments) => {
        if (deleteLevel === 0) {
          return prevComments.filter(
            (comment) => comment._id !== commentIdToDelete
          );
        } else {
          return prevComments.map((comment) => {
            if (comment._id === parentIdToDelete) {
              return {
                ...comment,
                replies: (comment.replies || []).filter(
                  (reply) => reply._id !== commentIdToDelete
                ),
              };
            }
            return comment;
          });
        }
      });
    });

    try {
      if (deleteLevel === 0) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogPost/${blog._id}/comments/${commentIdToDelete}`,
          { data: { userId: currentUserId } } // Send userId for backend authorization
        );
      } else {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogPost/${blog._id}/comments/${parentIdToDelete}/replies/${commentIdToDelete}`,
          { data: { userId: currentUserId } } // Send userId for backend authorization
        );
      }

      await fetchComments(false);
    } catch (err) {
      console.error("Error deleting comment or reply", err);
      await fetchComments(true); // Revert optimistic change on error
    } finally {
      setDeleteConfirmationOpen(false);
      setCommentIdToDelete(null);
      setParentIdToDelete(null);
      setDeleteLevel(0);
    }
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6 border-b pb-2">Comments</h3>

      {/* Input for main comment */}
      {currentUserId ? ( // Only show comment input if logged in
        <div className="flex flex-col gap-3 mb-6">
          <textarea
            className="w-full border border-gray-100 bg-white text-black rounded-md p-3 text-sm resize-none shadow-sm"
            rows={4}
            placeholder="Leave a comment..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isPosting}
          />
          <button
            onClick={postComment}
            className="self-end bg-slate-800 text-white px-6 py-2 rounded-md transition disabled:opacity-50"
            disabled={isPosting || !message.trim()}
          >
            {isPosting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      ) : (
        <p className="mb-6 text-gray-600">Please log in to leave a comment.</p>
      )}

      {/* Render comments and replies */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading comments...</p>
      ) : comments.length > 0 ? (
        <div className="bg-white border rounded-lg p-4 shadow-sm space-y-4">
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onReply={postReply}
              onEdit={editComment}
              onEditReply={editReply}
              onLike={toggleLike}
              onDeleteRequest={(id, level) =>
                handleDeleteRequest(id, level, comment._id)
              }
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyText={replyText}
              setReplyText={setReplyText}
              editingCommentId={editingCommentId}
              setEditingCommentId={setEditingCommentId}
              editText={editText}
              setEditText={setEditText}
              level={0}
              currentUser={currentUser} // Pass current user
              currentUserId={currentUserId} // Pass current user ID
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No comments yet.</p>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmationOpen}
        type="danger"
        title="Delete Comment"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmationOpen(false)}
        onClose={() => setDeleteConfirmationOpen(false)}
        onRequestClose={() => setDeleteConfirmationOpen(false)}
      >
        <p>
          Are you sure you want to discard this? This action can&apos;t be
          undone.{" "}
        </p>
      </ConfirmDialog>
    </div>
  );
}
