import React, { useState, useRef, useEffect } from 'react';
import defaultAvatar from '../assets/dashboard/dashboard-user-avatar.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const Messages = () => {
  // Mock data for mentors and conversations
  const mentors = [
    { id: 1, name: 'Harry', lastMessage: 'Sure! Let’s discuss.', timestamp: '10:30 AM' },
    { id: 2, name: 'Prashant', lastMessage: 'I’ll send the details.', timestamp: '9:15 AM' },
  ];

  const [selectedMentor, setSelectedMentor] = useState(mentors[0]);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Harry', text: 'Hello! How can I help you today?' },
    { id: 2, sender: 'You', text: 'I need help with a data science project.' },
    { id: 3, sender: 'Harry', text: 'Sure! Let’s discuss the details.' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Ref to track the chat messages container
  const messagesEndRef = useRef(null);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMentorSelect = (mentor) => {
    setSelectedMentor(mentor);
    // Reset messages for the selected mentor (mock logic)
    setMessages([
      { id: 1, sender: mentor.name, text: `Hi, I’m ${mentor.name}. How can I assist you?` },
    ]);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    setMessages([...messages, { id: messages.length + 1, sender: 'You', text: newMessage }]);
    setNewMessage('');
  };

  return (
    <div className="messages">
      {/* Left Part - Mentor List */}
      <div className="left-part-messages">
        <div className="mentor-dropdown">
          <select id="mentor-select" className="mentor-select" disabled>
            <option>My Students</option>
          </select>
        </div>

        {/* List of Mentors */}
        <div className="mentor-list">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className={`mentor-item ${
                mentor.id === selectedMentor.id ? 'mentor-item-selected' : ''
              }`}
              onClick={() => handleMentorSelect(mentor)}
            >
              <img src={defaultAvatar} alt="Mentor Avatar" className="mentor-avatar" />
              <div className="mentor-info">
                <div className="mentor-name">{mentor.name}</div>
                <div className="mentor-last-message">{mentor.lastMessage}</div>
              </div>
              <div className="mentor-timestamp">{mentor.timestamp}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Box */}
      <div className="chat-box">
        <div className="chat-header">
          <img src={defaultAvatar} alt="Mentor Avatar" className="chat-mentor-avatar" />
          <div className="chat-mentor-details">
            <div className="chat-mentor-name">{selectedMentor.name}</div>
            <div className="chat-mentor-profession">{selectedMentor.profession || 'Mentor'}</div>
          </div>
        </div>
        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message ${
                message.sender === 'You' ? 'chat-message-sender' : 'chat-message-receiver'
              }`}
            >
              <span className="chat-message-text">{message.text}</span>
            </div>
          ))}
          {/* Dummy div to ensure scrolling to the bottom */}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="chat-send-icon"
            onClick={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default Messages;