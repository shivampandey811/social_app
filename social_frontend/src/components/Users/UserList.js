import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const Users = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users/users/');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchReceivedRequests = async () => {
      try {
        const response = await api.get('/chatapp/received_interests/');
        setReceivedRequests(response.data);
      } catch (error) {
        console.error('Error fetching received interests:', error);
      }
    };

    fetchUsers();
    fetchReceivedRequests();
  }, []);

  const sendRequest = async (recipientId) => {
    try {
      await api.post('/chatapp/interest/', { recipient: recipientId });
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      await api.post(`/chatapp/interest/action/`, { request_id: requestId, action: 'accept' });
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const isRequestReceived = (senderId) => {
    return receivedRequests.some((request) => request.sender.id === senderId && !request.accepted);
  };

  const getRequestId = (senderId) => {
    const request = receivedRequests.find((request) => request.sender.id === senderId && !request.accepted);
    return request ? request.id : null;
  };

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.username}
            {isRequestReceived(u.id) ? (
              <button onClick={() => acceptRequest(getRequestId(u.id))}>Accept Request</button>
            ) : (
              <button onClick={() => sendRequest(u.id)}>Send Request</button>
            )}
            <button onClick={() => navigate(`/chatapp/chat/chat_${user.id}_${u.id}`)}>Chat</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
