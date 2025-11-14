import { useState, useEffect } from 'react';
import { useSocket } from './socket/socket.js';
import LoginForm from './components/LoginForm.jsx';
import ChatRoom from './components/ChatRoom.jsx';
import { Toaster } from 'react-hot-toast';

function App() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isConnected, messages } = useSocket();

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Show notifications for new messages when not focused
  useEffect(() => {
    if (!isLoggedIn || !messages.length) return;

    const latestMessage = messages[messages.length - 1];
    if (latestMessage && latestMessage.sender !== username) {
      // Show browser notification
      if ('Notification' in window && Notification.permission === 'granted' && document.hidden) {
        new Notification(`New message from ${latestMessage.sender}`, {
          body: latestMessage.message,
          icon: '/vite.svg',
        });
      }

      // Play sound notification
      const audio = new Audio('/notification.mp3');
      audio.play().catch(() => {
        // Fallback: create a simple beep
        const beep = new AudioContext();
        const oscillator = beep.createOscillator();
        const gainNode = beep.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(beep.destination);
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.1, beep.currentTime);
        oscillator.start(beep.currentTime);
        oscillator.stop(beep.currentTime + 0.1);
      });
    }
  }, [messages, username, isLoggedIn]);

  const handleLogin = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUsername('');
    setIsLoggedIn(false);
  };

  return (
    <div className="app">
      <Toaster position="top-right" />
      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} isConnected={isConnected} />
      ) : (
        <ChatRoom username={username} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;