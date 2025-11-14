import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../socket/socket.js';
import MessageList from './MessageList.jsx';
import MessageInput from './MessageInput.jsx';
import UserList from './UserList.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import { LogOut, Users, Hash } from 'lucide-react';
import toast from 'react-hot-toast';

const ChatRoom = ({ username, onLogout }) => {
  const {
    messages,
    users,
    typingUsers,
    currentRoom,
    sendMessage,
    sendPrivateMessage,
    setTyping,
    switchRoom,
    disconnect,
    isConnected
  } = useSocket();

  const [availableRooms, setAvailableRooms] = useState(['general', 'random', 'tech']);

  const [showUsers, setShowUsers] = useState(false);
  const [privateRecipient, setPrivateRecipient] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({ general: 0, random: 0, tech: 0 });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (message) => {
    if (privateRecipient) {
      sendPrivateMessage(privateRecipient.id, message);
      toast.success(`Private message sent to ${privateRecipient.username}`);
    } else {
      sendMessage({ message });
    }
  };

  const handlePrivateMessage = (user) => {
    setPrivateRecipient(user);
    toast(`Now messaging ${user.username} privately`);
  };

  const handleRoomSwitch = (room) => {
    if (room !== currentRoom) {
      switchRoom(room);
      setUnreadCounts(prev => ({ ...prev, [room]: 0 }));
      toast.success(`Switched to ${room} room`);
    }
  };

  // Track unread messages for other rooms
  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (latestMessage && latestMessage.sender !== username) {
      availableRooms.forEach(room => {
        if (room !== currentRoom) {
          // In a real app, you'd check if the message is from this room
          // For simplicity, we'll increment for all other rooms
          setUnreadCounts(prev => ({ ...prev, [room]: prev[room] + 1 }));
        }
      });
    }
  }, [messages, currentRoom, username, availableRooms]);

  const handleLogout = () => {
    disconnect();
    onLogout();
    toast.success('Logged out successfully');
  };

  return (
    <div className="chat-room">
      <div className="chat-header">
        <div className="room-info">
          <Hash size={20} />
          <h2>{currentRoom.charAt(0).toUpperCase() + currentRoom.slice(1)}</h2>
        </div>
        <div className="room-switcher">
          {availableRooms.map(room => (
            <button
              key={room}
              onClick={() => handleRoomSwitch(room)}
              className={`room-btn ${room === currentRoom ? 'active' : ''}`}
            >
              {room.charAt(0).toUpperCase() + room.slice(1)}
              {unreadCounts[room] > 0 && room !== currentRoom && (
                <span className="unread-badge">{unreadCounts[room]}</span>
              )}
            </button>
          ))}
        </div>
        <div className="header-actions">
          <button
            onClick={() => setShowUsers(!showUsers)}
            className="users-toggle"
          >
            <Users size={20} />
            Users ({users.length})
          </button>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      <div className="chat-content">
        <div className="messages-section">
          <MessageList
            messages={messages}
            currentUser={username}
            ref={messagesEndRef}
          />
          <TypingIndicator typingUsers={typingUsers} />
          <MessageInput
            onSendMessage={handleSendMessage}
            onTyping={setTyping}
            privateRecipient={privateRecipient}
            onCancelPrivate={() => setPrivateRecipient(null)}
          />
        </div>

        {showUsers && (
          <div className="users-sidebar">
            <UserList
              users={users}
              currentUser={username}
              onPrivateMessage={handlePrivateMessage}
            />
          </div>
        )}
      </div>

      {!isConnected && (
        <div className="connection-warning">
          🔴 Disconnected from server
        </div>
      )}
    </div>
  );
};

export default ChatRoom;