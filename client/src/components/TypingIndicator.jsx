const TypingIndicator = ({ typingUsers }) => {
  if (typingUsers.length === 0) return null;

  const typingText = typingUsers.length === 1
    ? `${typingUsers[0]} is typing...`
    : `${typingUsers.slice(0, -1).join(', ')} and ${typingUsers[typingUsers.length - 1]} are typing...`;

  return (
    <div className="typing-indicator">
      <div className="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span className="typing-text">{typingText}</span>
    </div>
  );
};

export default TypingIndicator;