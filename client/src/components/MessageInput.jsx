import { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';

const MessageInput = ({ onSendMessage, onTyping, privateRecipient, onCancelPrivate }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSendMessage(message.trim());
    setMessage('');
    handleStopTyping();
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      onTyping(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 1000);
  };

  const handleStopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      onTyping(false);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="message-input-container">
      {privateRecipient && (
        <div className="private-notice">
          <span>Replying privately to {privateRecipient.username}</span>
          <button onClick={onCancelPrivate}>
            <X size={16} />
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          placeholder={privateRecipient ? `Private message to ${privateRecipient.username}...` : "Type a message..."}
          maxLength={500}
          autoFocus
        />
        <button type="submit" disabled={!message.trim()}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;