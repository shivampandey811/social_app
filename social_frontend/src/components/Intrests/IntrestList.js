import React, { useEffect, useState, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const InterestList = () => {
  const { user } = useContext(AuthContext);
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    const fetchInterests = async () => {
      const response = await api.get('/interests/');
      setInterests(response.data.filter((interest) => interest.recipient.id === user.id));
    };
    fetchInterests();
  }, [user]);

  const acceptInterest = async (interestId) => {
    await api.post(`/interests/${interestId}/accept/`);
  };

  return (
    <div>
      <h2>Interests</h2>
      <ul>
        {interests.map((interest) => (
          <li key={interest.id}>
            {interest.sender.username}
            <button onClick={() => acceptInterest(interest.id)}>Accept</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InterestList;
