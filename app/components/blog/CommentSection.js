"use client";

import { useState, useRef, useEffect } from "react";

// Recursive Comment component
function Comment({
  comment,
  onReply,
  onEdit,
  onLike,
  replyingTo,
  setReplyingTo,
  replyText,
  setReplyText,
  editingCommentId,
  setEditingCommentId,
  editText,
  setEditText,
  level = 0,
}) {
  const isReplying = replyingTo === comment.id;
  const isEditing = editingCommentId === comment.id;

  const replyInputRef = useRef(null);
  const editInputRef = useRef(null);

  useEffect(() => {
    if (isReplying && replyInputRef.current) {
      replyInputRef.current.focus();
    }
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isReplying, isEditing]);

  return (
    <div className={`mt-4 ${level > 0 ? "ml-4 border-l pl-4 border-gray-200" : ""}`}>
      <div>
        <div className="flex justify-between items-center">
          <p className="font-semibold text-sm text-gray-800">{comment.name}</p>
          <p className="text-xs text-gray-400">{comment.timestamp}</p>
        </div>

        {/* Edit Mode */}
        {isEditing ? (
          <>
            <textarea
              ref={editInputRef}
              rows={2}
              className="w-full border border-blue-400 rounded-md p-2 text-sm mt-1"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <div className="flex gap-2 mt-2">
              <button
                className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
                onClick={() => {
                  onEdit(comment.id, editText);
                  setEditingCommentId(null);
                  setEditText("");
                }}
              >
                Save
              </button>
              <button
                className="text-sm text-gray-600 hover:underline"
                onClick={() => {
                  setEditingCommentId(null);
                  setEditText("");
                }}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-700 mt-1">{comment.message}</p>
        )}

        {/* Action Buttons */}
        {!isEditing && (
          <div className="flex gap-4 text-xs text-primary mt-2">
            <button onClick={() => setReplyingTo(isReplying ? null : comment.id)} className="hover:underline">
              {isReplying ? "Cancel" : "Reply"}
            </button>
            <button
              onClick={() => {
                setEditingCommentId(comment.id);
                setEditText(comment.message);
              }}
              className="hover:underline"
            >
              Edit
            </button>
            <button
  onClick={() => onLike(comment.id)}
  className={`flex items-center gap-1 text-base font-semibold ${
    comment.likedByUser ? "text-red-500" : "text-gray-500"
  } hover:underline`}
>
  ♥ {comment.likes > 0 ? comment.likes : ""}
</button>

          </div>
        )}

        {/* Reply Input */}
        {isReplying && (
          <div className="mt-3 flex flex-col gap-2">
            <textarea
              ref={replyInputRef}
              rows={2}
              className="w-full border border-gray-300 focus:border-primary rounded-md p-2 text-sm resize-none"
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <button
              onClick={() => {
                onReply(comment.id, replyText);
                setReplyText("");
                setReplyingTo(null);
              }}
              className="self-start bg-primary text-white px-4 py-1.5 rounded-md hover:bg-primary/90 transition text-sm"
            >
              Reply
            </button>
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {comment.replies?.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onEdit={onEdit}
              onLike={onLike}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyText={replyText}
              setReplyText={setReplyText}
              editingCommentId={editingCommentId}
              setEditingCommentId={setEditingCommentId}
              editText={editText}
              setEditText={setEditText}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Main Comment Section
export default function CommentSection() {
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  // Create new top-level comment
  const postComment = () => {
    if (!message.trim()) return;

    const newComment = {
      id: Date.now(),
      name: "Anonymous",
      message,
      timestamp: new Date().toLocaleString(),
      replies: [],
      likes: 0,
      likedByUser: false,
    };

    setComments([newComment, ...comments]);
    setMessage("");
  };

  // Add reply to any comment
  const postReply = (parentId, text) => {
    const addReply = (items) =>
      items.map((item) => {
        if (item.id === parentId) {
          return {
            ...item,
            replies: [
              {
                id: Date.now(),
                name: "Anonymous",
                message: text,
                timestamp: new Date().toLocaleString(),
                replies: [],
                likes: 0,
                likedByUser: false,
              },
              ...item.replies,
            ],
          };
        } else if (item.replies?.length) {
          return {
            ...item,
            replies: addReply(item.replies),
          };
        }
        return item;
      });

    setComments(addReply(comments));
  };

  // Edit a comment or reply
  const editComment = (id, newText) => {
    const updateText = (items) =>
      items.map((item) => {
        if (item.id === id) {
          return { ...item, message: newText };
        } else if (item.replies?.length) {
          return { ...item, replies: updateText(item.replies) };
        }
        return item;
      });

    setComments(updateText(comments));
  };

  // Like/Unlike a comment
  const toggleLike = (id) => {
    const updateLikes = (items) =>
      items.map((item) => {
        if (item.id === id) {
          const liked = !item.likedByUser;
          return {
            ...item,
            likedByUser: liked,
            likes: liked ? item.likes + 1 : item.likes - 1,
          };
        } else if (item.replies?.length) {
          return { ...item, replies: updateLikes(item.replies) };
        }
        return item;
      });

    setComments(updateLikes(comments));
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6 border-b pb-2">Comments</h3>

      {/* Input box for new comment */}
      <div className="flex flex-col gap-3 mb-6">
        <textarea
          className="w-full border border-gray-300 focus:border-primary rounded-md p-3 text-sm resize-none shadow-sm"
          rows={4}
          placeholder="Leave a comment..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={postComment}
          className="self-end bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition"
        >
          Post Comment
        </button>
      </div>

      {/* Unified comment thread */}
      {comments.length > 0 && (
        <div className="bg-white border rounded-lg p-4 shadow-sm space-y-4">
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onReply={postReply}
              onEdit={editComment}
              onLike={toggleLike}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyText={replyText}
              setReplyText={setReplyText}
              editingCommentId={editingCommentId}
              setEditingCommentId={setEditingCommentId}
              editText={editText}
              setEditText={setEditText}
            />
          ))}
        </div>
      )}
    </div>
  );
}
