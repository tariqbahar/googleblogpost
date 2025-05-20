"use client";
import { useEffect, useState } from "react";
import ConfirmDialog from "../ConfirmDialog";
import Comment from "./Comment";
import axios from "axios";
// import { useSession } from "next-auth/react";
export default function CommentSection({ blog }) {
  const [comments, setComments] = useState([]);
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

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogPost/${blog._id}/comments`
      );
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [blog._id]);

  const postComment = async () => {
    if (!message.trim()) return;
    setIsPosting(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogPost/${blog._id}/comments`,
        {
          blogId: blog._id,
          userId,
          message,
        }
      );
      await fetchComments(); // Ensures fresh data and structure
      setMessage("");
    } catch (err) {
      console.error("Error posting comment", err);
    } finally {
      setIsPosting(false);
    }
  };

  const postReply = async (parentId, text) => {
    if (!text.trim()) return;
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
      await fetchComments();
      setReplyText("");
      setReplyingTo(null);
    } catch (err) {
      console.error("Error posting reply", err);
    } finally {
      setIsReplying(false);
    }
  };

  const editComment = async (id, newText) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogPost/${blog._id}/comments/${id}`,
        {
          message: newText,
        }
      );
      await fetchComments();
      setEditingCommentId(null);
      setEditText("");
    } catch (err) {
      console.error("Error editing comment", err);
    }
  };
  const editReply = async (parentId, replyId, newText) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogPost/${blog._id}/comments/${parentId}/replies/${replyId}`,
        { message: newText }
      );
      await fetchComments();
      setEditingCommentId(null);
      setEditText("");
    } catch (err) {
      console.error("Error editing reply", err);
    }
  };

  const toggleLike = async (id) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogPost/${blog._id}/comments/${id}`
      );
      const updateLikes = (items) =>
        items.map((item) => {
          if (item.id === id) return { ...item, ...res.data };
          else if (item.replies?.length)
            return { ...item, replies: updateLikes(item.replies) };
          return item;
        });
      setComments(updateLikes(comments));
    } catch (err) {
      console.error("Error liking comment", err);
    }
  };

  const handleDeleteRequest = (id, level, parentId = null) => {
    setCommentIdToDelete(id);
    setParentIdToDelete(parentId);
    setDeleteLevel(level);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirm = async () => {
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
      await fetchComments();
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
      {comments.length > 0 && (
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
              onEditReply={editReply} // ✅ Pass this
              setEditText={setEditText}
              level={0}
            />
          ))}
        </div>
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
