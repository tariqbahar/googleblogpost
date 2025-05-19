import React, { useRef, useEffect } from 'react'

function Comment({
    comment,
    onReply,
    onEdit,
    onEditReply,
    onLike,
    onDeleteRequest,
    replyingTo,
    setReplyingTo,
    replyText,
    setReplyText,
    editingCommentId,
    setEditingCommentId,
    editText,
    setEditText,
    level = 0,
    parentId = null,
}) {
    const isReplying = replyingTo === comment._id
    const isEditing = editingCommentId === comment._id

    const replyInputRef = useRef(null)
    const editInputRef = useRef(null)

    useEffect(() => {
        if (isReplying && replyInputRef.current) replyInputRef.current.focus()
        if (isEditing && editInputRef.current) editInputRef.current.focus()
    }, [isReplying, isEditing])

    const formatTimestamp = (ts) => {
        try {
            const date = new Date(ts)
            return date.toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
            })
        } catch {
            return ts
        }
    }

    // fallback avatar (can be replaced with actual image URLs)
    const avatarUrl =
        comment.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.name)}&background=random`

    return (
        <div className={`mt-4 ${level > 0 ? 'ml-6' : ''}`}>
            <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-start gap-3">
                    <img
                        src={avatarUrl}
                        alt={comment.name}
                        className="w-10 h-10 rounded-full object-cover border"
                    />
                    <div className="flex-1">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-semibold text-gray-800">
                                    {comment.name}
                                </p>
                                <span className="text-xs text-gray-500">
                                    {formatTimestamp(comment.timestamp)}
                                </span>
                            </div>
                        </div>

                        {/* Message or edit box */}
                        <div className="mt-2">
                            {isEditing ? (
                                <>
                                    <textarea
                                        ref={editInputRef}
                                        rows={3}
                                        className="w-full p-2 border border-blue-400 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={editText}
                                        onChange={(e) =>
                                            setEditText(e.target.value)
                                        }
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            className="px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                                            onClick={() => {
                                                if (level === 0) {
                                                    onEdit(
                                                        comment._id,
                                                        editText,
                                                    )
                                                } else {
                                                    onEditReply(
                                                        parentId,
                                                        comment._id,
                                                        editText,
                                                    )
                                                }
                                                setEditingCommentId(null)
                                                setEditText('')
                                            }}
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingCommentId(null)
                                                setEditText('')
                                            }}
                                            className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <p className="text-sm text-gray-700 whitespace-pre-wrap mt-1">
                                    {comment.message}
                                </p>
                            )}
                        </div>

                        {/* Action buttons */}
                        {!isEditing && (
                            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                                {level === 0 && (
                                    <button
                                        onClick={() =>
                                            setReplyingTo(
                                                isReplying ? null : comment._id,
                                            )
                                        }
                                        className="text-blue-600 hover:underline"
                                    >
                                        {isReplying ? 'Cancel' : 'Reply'}
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setEditingCommentId(comment._id)
                                        setEditText(comment.message)
                                    }}
                                    className="text-gray-600 hover:underline"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() =>
                                        onDeleteRequest(comment._id, level)
                                    }
                                    className="text-red-500 hover:underline"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => onLike(comment._id)}
                                    className={`flex items-center gap-1 font-semibold ${
                                        comment.likedByUser
                                            ? 'text-red-500'
                                            : 'text-gray-400'
                                    } hover:underline`}
                                >
                                    ♥ {comment.likes > 0 ? comment.likes : ''}
                                </button>
                            </div>
                        )}

                        {/* Reply box */}
                        {isReplying && (
                            <div className="mt-4 flex flex-col gap-2">
                                <textarea
                                    ref={replyInputRef}
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-md p-2 text-sm resize-none focus:ring-2 focus:ring-primary"
                                    placeholder="Write your reply..."
                                    value={replyText}
                                    onChange={(e) =>
                                        setReplyText(e.target.value)
                                    }
                                />
                                <button
                                    onClick={() => {
                                        onReply(comment._id, replyText)
                                        setReplyText('')
                                        setReplyingTo(null)
                                    }}
                                    className="self-start bg-primary text-white px-4 py-1.5 rounded-md hover:bg-primary/90 transition text-sm"
                                >
                                    Reply
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Replies */}
            {comment.replies?.length > 0 && (
                <div className="mt-3 space-y-3">
                    {comment.replies.map((reply) => (
                        <Comment
                            key={reply._id}
                            comment={reply}
                            onReply={onReply}
                            onEdit={onEdit}
                            onEditReply={onEditReply}
                            onLike={onLike}
                            onDeleteRequest={onDeleteRequest}
                            replyingTo={replyingTo}
                            setReplyingTo={setReplyingTo}
                            replyText={replyText}
                            setReplyText={setReplyText}
                            editingCommentId={editingCommentId}
                            setEditingCommentId={setEditingCommentId}
                            editText={editText}
                            setEditText={setEditText}
                            level={level + 1}
                            parentId={comment._id}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Comment
