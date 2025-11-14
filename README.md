# Real-Time Chat Application with Socket.io

A fully-featured real-time chat application built with Socket.io, React, and Node.js. This application demonstrates bidirectional communication between clients and server, implementing comprehensive chat functionality with multiple rooms, private messaging, and advanced features.

## 🚀 Features

### Core Features
- ✅ **Real-time messaging** using Socket.io
- ✅ **User authentication** with username-based login
- ✅ **Online presence** indicators
- ✅ **Multiple chat rooms** (General, Random, Tech)
- ✅ **Private messaging** between users
- ✅ **Typing indicators** showing when users are composing messages
- ✅ **Message timestamps** with proper formatting

### Advanced Features
- ✅ **Real-time notifications** (browser notifications and sound alerts)
- ✅ **Unread message counts** with badges on room tabs
- ✅ **Message reactions** (👍 ❤️ 😂 😠)
- ✅ **Read receipts** showing who has read messages
- ✅ **Responsive design** that works on desktop and mobile
- ✅ **Connection status** indicators
- ✅ **Message history** persistence during sessions

### User Experience
- ✅ **Intuitive UI** with modern design
- ✅ **Smooth animations** and transitions
- ✅ **Toast notifications** for user feedback
- ✅ **Auto-scroll** to latest messages
- ✅ **Keyboard shortcuts** (Enter to send)
- ✅ **Emoji reactions** for engagement

## 🏗️ Project Structure

```
socketio-chat/
├── client/                 # React front-end
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── LoginForm.jsx
│   │   │   ├── ChatRoom.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── UserList.jsx
│   │   │   └── TypingIndicator.jsx
│   │   ├── socket/
│   │   │   └── socket.js    # Socket.io client setup
│   │   ├── App.jsx          # Main application component
│   │   ├── main.jsx         # React entry point
│   │   └── index.css        # Global styles
│   ├── index.html           # HTML template
│   ├── vite.config.js       # Vite configuration
│   └── package.json         # Client dependencies
├── server/                 # Node.js back-end
│   ├── server.js            # Main server file with Socket.io
│   └── package.json         # Server dependencies
├── README.md                # Project documentation
└── Week5-Assignment.md      # Assignment instructions
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Modern web browser with notification support

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd socketio-chat
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the server** (from project root)
   ```bash
   cd server
   npm run dev
   ```
   Server will run on http://localhost:5000

2. **Start the client** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```
   Client will run on http://localhost:5173

3. **Open your browser** and navigate to http://localhost:5173

## 🎯 How to Use

1. **Join the Chat**
   - Enter a username in the login form
   - Select a chat room (General, Random, or Tech)
   - Click "Join Chat"

2. **Send Messages**
   - Type your message in the input field
   - Press Enter or click the send button
   - Messages appear instantly for all users in the room

3. **Private Messaging**
   - Click on a user's name in the user list
   - Send messages that only you and the recipient can see
   - Private messages are marked with "(Private)"

4. **Switch Rooms**
   - Click on room tabs in the header
   - Unread message counts show as badges
   - Room switching preserves message history

5. **React to Messages**
   - Hover over any message
   - Click the "+" button to add reactions
   - Choose from 👍 ❤️ 😂 😠

6. **Notifications**
   - Grant browser notification permission when prompted
   - Receive notifications for new messages when tab is not active
   - Sound alerts play for incoming messages

## 🔧 Technical Implementation

### Server (Node.js + Express + Socket.io)
- **Real-time communication** via Socket.io
- **Room-based messaging** with Socket.io rooms
- **User management** with connection tracking
- **Message persistence** in memory (resets on server restart)
- **Event handling** for all chat operations

### Client (React + Socket.io Client)
- **Modern React** with hooks for state management
- **Real-time updates** via Socket.io client
- **Responsive design** with CSS Grid and Flexbox
- **Toast notifications** with react-hot-toast
- **Icons** from Lucide React
- **Date formatting** with date-fns

### Key Socket Events
- `user_join` - User joins a room
- `send_message` - Send public message
- `private_message` - Send private message
- `switch_room` - Change rooms
- `add_reaction` - Add emoji reaction
- `mark_as_read` - Mark message as read
- `typing` - Typing indicator

## 📱 Screenshots

### Login Screen
Clean, simple login interface with room selection.

### Chat Interface
Full-featured chat with rooms, users, and message reactions.

### Mobile Responsive
Works seamlessly on mobile devices.

## 🚀 Deployment

### Server Deployment
- **Recommended**: Railway, Render, or Heroku
- **Environment variables**: Set `PORT` for production
- **CORS**: Configure allowed origins for client URL

### Client Deployment
- **Recommended**: Vercel, Netlify, or GitHub Pages
- **Build command**: `npm run build`
- **Environment variables**: Set `VITE_SOCKET_URL` for production server

## 🌐 Live Demo

- **Client**: https://real-time-communication-with-socket-indol.vercel.app/
- **Server**: https://real-time-communication-with-socket-io-nhsw.onrender.com/

## 🧪 Testing

### Manual Testing Checklist
- [ ] User can join chat with username
- [ ] Real-time messaging works
- [ ] Multiple users can chat simultaneously
- [ ] Room switching preserves messages
- [ ] Private messaging works
- [ ] Typing indicators appear
- [ ] Message reactions work
- [ ] Read receipts update
- [ ] Notifications work when tab inactive
- [ ] Responsive design on mobile
- [ ] Connection status updates

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of a course assignment. See assignment instructions for usage rights.

## 🙏 Acknowledgments

- [Socket.io](https://socket.io/) for real-time communication
- [React](https://reactjs.org/) for the UI framework
- [Lucide React](https://lucide.dev/) for icons
- [React Hot Toast](https://react-hot-toast.com/) for notifications
- [Date-fns](https://date-fns.org/) for date formatting

---

**Built with ❤️ for the MERN Stack Course**