import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const Users = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await api.get('/users/');
      setUsers(response.data);
    };

    const fetchRequests = async () => {
      const response = await api.get('/interests/');
      setRequests(response.data);
    };

    fetchUsers();
    fetchRequests();
  }, []);

  const sendRequest = async (recipientId) => {
    await api.post('/interests/', { recipient: recipientId });
  };

  const acceptRequest = async (requestId) => {
    await api.post(`/interests/${requestId}/accept/`);
  };

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.username}
            {requests.find((r) => r.sender === u.id && r.recipient === user.id) ? (
              <button onClick={() => acceptRequest(u.id)}>Accept Request</button>
            ) : (
              <button onClick={() => sendRequest(u.id)}>Send Request</button>
            )}
            <button onClick={() => navigate(`/chat/chat_${user.id}_${u.id}`)}>Chat</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
