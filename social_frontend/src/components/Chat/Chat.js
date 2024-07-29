import React, { useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from '../../context/AuthContext';

const socket = io('http://127.0.0.1:8000'); // Update if the backend is running on a different host/port

const Chat = ({ chatRoom }) => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (user && chatRoom) {
      socket.emit('join', chatRoom);

      socket.on('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.emit('leave', chatRoom);
        socket.off();
      };
    }
  }, [user, chatRoom]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('sendMessage', { chatRoom, message, sender: user.username });
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Chat Room: {chatRoom}</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
