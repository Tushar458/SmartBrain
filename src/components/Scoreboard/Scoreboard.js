import React, { useEffect, useState } from 'react';
import './Scoreboard.css'; // Import the CSS file

const Scoreboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:3001/leaderboard');
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  return (
    <div className="container"> {/* Container to center the table */}
      <h2 className="title">Scoreboard</h2> {/* Add class to the title */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Entries</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.entries}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Scoreboard;
