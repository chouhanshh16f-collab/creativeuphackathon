import { useState } from 'react';
import { MessageCircle, Send, User, Clock, Trash2, Edit2 } from 'lucide-react';

export default function CommentSystem({ itemId, comments, setComments, currentUser }) {
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);

  const addComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: `comment-${Date.now()}`,
      text: newComment.trim(),
      author: currentUser || 'Unknown User',
      timestamp: new Date().toISOString(),
      edited: false
    };
    setComments(prev => ({ ...prev, [itemId]: [...(prev[itemId] || []), comment] }));
    setNewComment('');
  };

  const deleteComment = (commentId) => {
    setComments(prev => ({
      ...prev,
      [itemId]: prev[itemId].filter(c => c.id !== commentId)
    }));
  };

  const editComment = (commentId, newText) => {
    setComments(prev => ({
      ...prev,
      [itemId]: prev[itemId].map(c => 
        c.id === commentId ? { ...c, text: newText, edited: true } : c
      )
    }));
    setEditingComment(null);
  };

  const itemComments = comments[itemId] || [];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <MessageCircle size={16} />
        <span style={styles.count}>{itemComments.length} Comments</span>
      </div>

      <div style={styles.commentList}>
        {itemComments.length === 0 ? (
          <div style={styles.emptyState}>No comments yet. Start the conversation!</div>
        ) : (
          itemComments.map(comment => (
            <div key={comment.id} style={styles.commentItem}>
              <div style={styles.commentHeader}>
                <div style={styles.commentAuthor}>
                  <User size={12} />
                  <span>{comment.author}</span>
                </div>
                <div style={styles.commentMeta}>
                  <span style={styles.commentTime}>
                    <Clock size={10} /> {new Date(comment.timestamp).toLocaleDateString()}
                  </span>
                  {comment.edited && <span style={styles.editedTag}>edited</span>}
                </div>
              </div>

              {editingComment === comment.id ? (
                <div style={styles.editContainer}>
                  <input
                    style={styles.editInput}
                    defaultValue={comment.text}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        editComment(comment.id, e.target.value);
                      }
                      if (e.key === 'Escape') {
                        setEditingComment(null);
                      }
                    }}
                    autoFocus
                  />
                  <div style={styles.editActions}>
                    <button style={styles.saveBtn} onClick={(e) => {
                      const input = e.target.parentElement.previousSibling;
                      editComment(comment.id, input.value);
                    }}>Save</button>
                    <button style={styles.cancelBtn} onClick={() => setEditingComment(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={styles.commentText}>{comment.text}</div>
              )}

              <div style={styles.commentActions}>
                <button style={styles.actionBtn} onClick={() => setEditingComment(comment.id)}>
                  <Edit2 size={12} /> Edit
                </button>
                <button style={{ ...styles.actionBtn, color: '#C97B5F' }} onClick={() => deleteComment(comment.id)}>
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              addComment();
            }
          }}
        />
        <button style={styles.sendBtn} onClick={addComment}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { background: '#FBF8F1', border: '1px solid #E4DCC8', borderRadius: 8, padding: 16 },
  header: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: '#5C7A6B', fontSize: 13, fontWeight: 600 },
  count: { fontSize: 12, fontWeight: 400, color: '#9AA79C' },
  commentList: { maxHeight: 300, overflowY: 'auto', marginBottom: 12 },
  commentItem: { borderBottom: '1px solid #F4EFE4', padding: '12px 0' },
  commentHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  commentAuthor: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: '#1E2320' },
  commentMeta: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, color: '#9AA79C' },
  commentTime: { display: 'flex', alignItems: 'center', gap: 4 },
  editedTag: { fontStyle: 'italic', color: '#B8AF9A' },
  commentText: { fontSize: 13, color: '#4B4640', padding: '4px 0' },
  commentActions: { display: 'flex', gap: 8, marginTop: 4 },
  actionBtn: { background: 'transparent', border: 'none', fontSize: 10, color: '#9AA79C', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: '2px 4px', borderRadius: 3 },
  inputContainer: { display: 'flex', gap: 8 },
  input: { flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid #DCD3BE', background: '#F4EFE4', fontSize: 12, color: '#3C4A45', outline: 'none', fontFamily: "'Inter', sans-serif" },
  sendBtn: { background: '#5C7A6B', border: 'none', color: '#F4EFE4', padding: '8px 12px', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  emptyState: { textAlign: 'center', padding: '20px', color: '#9AA79C', fontSize: 12 },
  editContainer: { marginBottom: 4 },
  editInput: { width: '100%', padding: '6px 10px', borderRadius: 4, border: '1px solid #5C7A6B', background: '#F4EFE4', fontSize: 13, color: '#3C4A45', fontFamily: "'Inter', sans-serif", marginBottom: 4 },
  editActions: { display: 'flex', gap: 8 },
  saveBtn: { background: '#5C7A6B', border: 'none', color: '#F4EFE4', padding: '4px 10px', borderRadius: 4, fontSize: 11, cursor: 'pointer' },
  cancelBtn: { background: 'transparent', border: '1px solid #DCD3BE', color: '#6B6459', padding: '4px 10px', borderRadius: 4, fontSize: 11, cursor: 'pointer' },
};