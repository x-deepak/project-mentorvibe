// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';
import GoogleAuthSuccess from './components/auth/GoogleAuthSuccess';

import Header from './home/Header.jsx'
// import Dashboard from './components/dashboard/Dashboard';
// import MentorDashboard from './components/dashboard/MentorDashboard';
// import Home from './components/pages/Home';
// import About from './components/pages/About';
// import Mentors from './components/pages/Mentors';
import PrivateRoute from './components/routing/PrivateRoute';
// import './App.css';
import './index.css'


import Home from "./home/Home";
import Search from "./searchPage/Search";
import ErrorPage from "./ErrorPage";



const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <LoginModal />
          <RegisterModal />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} errorElement={<ErrorPage />} />
              <Route path="/search" element={<Search />} />
              <Route path="/auth-success" element={<GoogleAuthSuccess />} />
              
              {/* Protected Routes */}

              {/* uncomment from here -> */}
              {/* <Route path="/user/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              
              <Route path="/mentor/dashboard" element={
                <PrivateRoute isMentorRoute={true}>
                  <MentorDashboard />
                </PrivateRoute>
              } /> */}
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;