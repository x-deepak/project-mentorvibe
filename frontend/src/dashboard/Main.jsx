import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Messages from './Messages';
import Profile from './Profile';
import BasicTabs from './Tabs';
import './styles.css';

const DMain = () => {
  return (
    <div className="dashpage">
      <BasicTabs />
      <div className='content'>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/message" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

export default DMain;