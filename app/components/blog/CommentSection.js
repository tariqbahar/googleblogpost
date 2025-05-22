"use client";
import { useEffect, useState, startTransition } from "react";
import ConfirmDialog from "../ConfirmDialog";
import Comment from "./Comment";
import axios from "axios";
// import { useSession } from "next-auth/react";
export default function CommentSection({ blog }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true); // Add this

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

  // const { data } = useSession();
  const user = "jawad erfani";
  const userId = "e0e1b27f-38f2-45c2-b330-6c3bc054aed6";
  // const user = data?.user;
  // const userId = user?.id;

  const fetchComments = async (showLoader = true) => {
    if (showLoader) setLoading(true); // Only show loading if not optimistic

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogPost/${blog._id}/comments`
      );
      setComments(res.data || []);
    } catch (error) {
      console.error("Error fetching comments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [blog._id]);

  const postComment = async () => {
    if (!message.trim()) return;
    const tempId = Date.now().toString(); // temporary ID
    const newComment = {
      _id: tempId, // temporary until backend assigns real ID
      message,
      userId,
      user,
      replies: [],
      likes: [],
      createdAt: new Date().toISOString(),
    };

    // Optimistically update UI
    startTransition(() => {
      setComments((prev) => [...prev, newComment]);
      setMessage("");
    });

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogPost/${blog._id}/comments`,
        {
          blogId: blog._id,
          userId,
          message,
        }
      );
      // Refresh the comments from server to get real IDs
      await fetchComments(false); // Don't show loading after optimistic update
    } catch (err) {
      console.error("Error posting comment", err);
      // Optionally: roll back optimistic update if it fails
      setComments((prev) => prev.filter((c) => c._id !== tempId));
    }
  };

  const postReply = async (parentId, text) => {
    if (!text.trim()) return;

    const tempId = Date.now().toString();
    const newReply = {
      _id: tempId,
      message: text,
      userId,
      user,
      createdAt: new Date().toISOString(),
      likes: [],
    };

    // Optimistic UI update
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

    setIsReplying(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogPost/${blog._id}/comments/${parentId}/replies`,
        {
          blogId: blog._id,
          userId,
          message: text,
        }
      );
      await fetchComments(false); // Sync real data
    } catch (err) {
      console.error("Error posting reply", err);
    } finally {
      setIsReplying(false);
    }
  };

  const editComment = async (id, newText) => {
    // Optimistic UI
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
      fetchComments(false); // Sync with backend
    } catch (err) {
      console.error("Error editing comment", err);
    }
  };

  const editReply = async (parentId, replyId, newText) => {
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
    }
  };

  const toggleLike = async (id) => {
    // Optimistic toggle
    startTransition(() => {
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment._id === id) {
            const hasLiked = comment.likes.includes(userId);
            const newLikes = hasLiked
              ? comment.likes.filter((uid) => uid !== userId)
              : [...comment.likes, userId];
            return { ...comment, likes: newLikes };
          }

          if (comment.replies?.length) {
            const updatedReplies = comment.replies.map((reply) => {
              if (reply._id === id) {
                const hasLiked = reply.likes.includes(userId);
                const newLikes = hasLiked
                  ? reply.likes.filter((uid) => uid !== userId)
                  : [...reply.likes, userId];
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogPost/${blog._id}/comments/${id}`
      );
      fetchComments(false); // Sync
    } catch (err) {
      console.error("Error toggling like", err);
    }
  };

  const handleDeleteRequest = (id, level, parentId = null) => {
    setCommentIdToDelete(id);
    setParentIdToDelete(parentId);
    setDeleteLevel(level);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirm = async () => {
    // Optimistic UI update
    startTransition(() => {
      setComments((prevComments) => {
        if (deleteLevel === 0) {
          // Optimistically remove the main comment
          return prevComments.filter(
            (comment) => comment._id !== commentIdToDelete
          );
        } else {
          // Optimistically remove the reply
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
        // Main comment
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogPost/${blog._id}/comments/${commentIdToDelete}`
        );
      } else {
        // Reply
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogPost/${blog._id}/comments/${parentIdToDelete}/replies/${commentIdToDelete}`
        );
      }

      await fetchComments(false); // Sync real data from backend
    } catch (err) {
      console.error("Error deleting comment or reply", err);
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
      <div className="flex flex-col gap-3 mb-6">
        <textarea
          className="w-full border border-gray-100 bg-white text-black  rounded-md p-3 text-sm resize-none shadow-sm"
          rows={4}
          placeholder="Leave a comment..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={postComment}
          className="self-end bg-slate-800 text-white px-6 py-2 rounded-md transition disabled:opacity-50"
          disabled={isPosting}
        >
          {isPosting ? "Posting..." : "Post Comment"}
        </button>
      </div>

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
              onEditReply={editReply}
              setEditText={setEditText}
              level={0}
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
          Are you sure you want discard this? This action can&apos;t be undo.{" "}
        </p>
      </ConfirmDialog>
    </div>
  );
}
