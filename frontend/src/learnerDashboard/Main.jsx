import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Messages from './Messages';
import Account from './Account';
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
          <Route path="/account" element={<Account />} />
        </Routes>
      </div>
    </div>
  );
};

export default DMain;