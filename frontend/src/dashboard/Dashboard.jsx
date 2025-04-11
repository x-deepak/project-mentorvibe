import React from 'react';

const Dashboard = () => {
  // Mock data for analytics
  const profileViews = 35;
  const classRequests = 10;

  return (
    <div className="dashboard">
      <h2>Dashboard Overview</h2>
      <div className="analytics">
        <div className="card">
          <h3>Recent Profile Views</h3>
          <p>{profileViews}</p>
        </div>
        <div className="card">
          <h3>Class Requests</h3>
          <p>{classRequests}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;