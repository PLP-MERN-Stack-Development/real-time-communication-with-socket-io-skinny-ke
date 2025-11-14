import { MessageCircle } from 'lucide-react';

const UserList = ({ users, currentUser, onPrivateMessage }) => {
  return (
    <div className="user-list">
      <h3>Online Users ({users.length})</h3>
      <div className="users">
        {users.map((user) => (
          <div key={user.id} className="user-item">
            <div className="user-info">
              <div className="user-avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span className="username">
                {user.username}
                {user.username === currentUser && ' (You)'}
              </span>
            </div>
            {user.username !== currentUser && (
              <button
                onClick={() => onPrivateMessage(user)}
                className="private-msg-btn"
                title={`Send private message to ${user.username}`}
              >
                <MessageCircle size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;