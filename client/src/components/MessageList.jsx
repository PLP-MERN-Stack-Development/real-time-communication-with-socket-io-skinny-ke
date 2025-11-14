import { forwardRef, useState } from 'react';
import { format } from 'date-fns';
import { useSocket } from '../socket/socket.js';
import { Heart, ThumbsUp, Laugh, Angry } from 'lucide-react';

const MessageList = forwardRef(({ messages, currentUser }, ref) => {
  const { addReaction, markAsRead } = useSocket();
  const [showReactions, setShowReactions] = useState(null);

  const reactionEmojis = [
    { emoji: '👍', icon: ThumbsUp },
    { emoji: '❤️', icon: Heart },
    { emoji: '😂', icon: Laugh },
    { emoji: '😠', icon: Angry },
  ];

  const handleReactionClick = (messageId, emoji) => {
    addReaction(messageId, emoji);
    setShowReactions(null);
  };

  const handleMessageHover = (messageId) => {
    markAsRead(messageId);
  };

  return (
    <div className="message-list">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`message ${msg.sender === currentUser ? 'own' : ''} ${msg.system ? 'system' : ''} ${msg.isPrivate ? 'private' : ''}`}
          onMouseEnter={() => handleMessageHover(msg.id)}
        >
          {msg.system ? (
            <div className="system-message">
              <span>{msg.message}</span>
            </div>
          ) : (
            <>
              <div className="message-header">
                <span className="sender">{msg.sender}</span>
                {msg.isPrivate && <span className="private-label">(Private)</span>}
                <span className="timestamp">
                  {format(new Date(msg.timestamp), 'HH:mm')}
                </span>
                {msg.readBy && msg.readBy.length > 1 && (
                  <span className="read-receipt">
                    Read by {msg.readBy.length - 1}
                  </span>
                )}
              </div>
              <div className="message-content">
                {msg.message}
              </div>
              {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                <div className="message-reactions">
                  {Object.entries(msg.reactions).map(([emoji, users]) => (
                    <span key={emoji} className="reaction">
                      {emoji} {users.length}
                    </span>
                  ))}
                </div>
              )}
              <div className="message-actions">
                <button
                  onClick={() => setShowReactions(showReactions === msg.id ? null : msg.id)}
                  className="reaction-btn"
                >
                  +
                </button>
                {showReactions === msg.id && (
                  <div className="reaction-picker">
                    {reactionEmojis.map(({ emoji, icon: Icon }) => (
                      <button
                        key={emoji}
                        onClick={() => handleReactionClick(msg.id, emoji)}
                        className="emoji-btn"
                      >
                        <Icon size={16} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      ))}
      <div ref={ref} />
    </div>
  );
});

MessageList.displayName = 'MessageList';

export default MessageList;