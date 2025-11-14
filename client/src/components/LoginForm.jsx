import { useState, useEffect } from 'react';
import { useSocket } from '../socket/socket.js';
import toast from 'react-hot-toast';

const LoginForm = ({ onLogin, isConnected }) => {
  const [username, setUsername] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('general');
  const [availableRooms, setAvailableRooms] = useState(['general']);
  const { connect } = useSocket();

  useEffect(() => {
    // Fetch available rooms
    fetch('/api/rooms')
      .then(res => res.json())
      .then(rooms => setAvailableRooms(rooms))
      .catch(err => console.error('Failed to fetch rooms:', err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }
    if (!isConnected) {
      toast.error('Not connected to server');
      return;
    }
    connect(username.trim(), selectedRoom);
    onLogin(username.trim());
    toast.success(`Welcome, ${username}! Joined ${selectedRoom} room.`);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Socket.io Chat</h1>
        <p>Enter your username and select a room to join</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={20}
          />
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
          >
            {availableRooms.map(room => (
              <option key={room} value={room}>
                {room.charAt(0).toUpperCase() + room.slice(1)}
              </option>
            ))}
          </select>
          <button type="submit" disabled={!isConnected}>
            {isConnected ? 'Join Chat' : 'Connecting...'}
          </button>
        </form>
        <div className="connection-status">
          Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;