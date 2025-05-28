import React, { useState, useRef, useEffect, useContext } from 'react';
import defaultAvatar from '../assets/dashboard/dashboard-user-avatar.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/AuthContext';

const apiUrl = import.meta.env.VITE_API_URL;

const Messages = () => {
  const { user } = useContext(AuthContext);

  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const messagesEndRef = useRef(null);

  // Fetch active conversations on load
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        if (!user?.token) return;
        const response = await fetch(`${apiUrl}/api/protected/user/conversations`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch conversations');
        const data = await response.json();
        const activeMentors = (data.conversations || [])
          .filter(conv => conv.isActive && conv.mentor)
          .map(conv => ({
            id: conv.mentor.id,
            name: conv.mentor.name,
            profession: conv.mentor.professionalTitle,
            profilePicture: conv.mentor.profilePicture,
            conversationId: conv.conversationId,
            lastMessage: conv.lastMessage ? conv.lastMessage.content : '',
            timestamp: conv.lastMessage
              ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
              : '',
          }));
        setMentors(activeMentors);
        if (activeMentors.length > 0) {
          setSelectedMentor(activeMentors[0]);
          // Fetch messages for the first mentor
          const firstMentor = activeMentors[0];
          const res = await fetch(
            `${apiUrl}/api/protected/user/messages?conversationId=${firstMentor.conversationId}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
              },
              credentials: 'include',
            }
          );
          if (res.ok) {
            const msgData = await res.json();
            setMessages(msgData.messages || []);
          } else {
            setMessages([]);
          }
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setMessages([]);
      }
    };
    fetchConversations();
  }, [user]);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleMentorSelect = async (mentor) => {
    setSelectedMentor(mentor);
    try {
      const res = await fetch(
        `${apiUrl}/api/protected/user/messages?conversationId=${mentor.conversationId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          credentials: 'include',
        }
      );
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Failed to fetch messages:', errorText);
        setMessages([]);
        return;
      }
      const data = await res.json();
      // Assuming data.messages is an array of { id, sender, text }
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !selectedMentor) return;

    try {
      const res = await fetch(`${apiUrl}/api/protected/user/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          content: newMessage,
          conversationId: selectedMentor.conversationId,
          mentorId: selectedMentor.id,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Failed to send message:', errorText);
        return;
      }

      // Get the saved message from the response
      const data = await res.json();
      const savedMessage = data.message; // Adjust if your backend returns differently

      setMessages([...messages, savedMessage]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="messages">
      {/* Left Part - Mentor List */}
      <div className="left-part-messages">
        <div className="mentor-dropdown">
          <select id="mentor-select" className="mentor-select" disabled>
            <option>My Mentors</option>
          </select>
        </div>

        {/* List of Mentors */}
        <div className="mentor-list">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className={`mentor-item ${selectedMentor && mentor.id === selectedMentor.id ? 'mentor-item-selected' : ''}`}
              onClick={() => handleMentorSelect(mentor)}
            >
              <img src={mentor.profilePicture || defaultAvatar} alt="Mentor Avatar" className="mentor-avatar" />
              <div className="mentor-info">
                <div className="mentor-name">{mentor.name}</div>
                <div className="mentor-meta">
                  <span className="mentor-last-message">{mentor.lastMessage || ''}</span>
                  <span className="mentor-timestamp">{mentor.timestamp || ''}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Box */}
      <div className="chat-box">
        <div className="chat-header">
          <img src={selectedMentor?.profilePicture || defaultAvatar} alt="Mentor Avatar" className="chat-mentor-avatar" />
          <div className="chat-mentor-details">
            <div className="chat-mentor-name">{selectedMentor?.name || ''}</div>
            <div className="chat-mentor-profession">{selectedMentor?.profession || 'Mentor'}</div>
          </div>
        </div>
        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`chat-message ${
                message.sender.id === user._id ? 'chat-message-sender' : 'chat-message-receiver'
              }`}
            >
              <span className="chat-message-text">{message.content}</span>
            </div>
          ))}
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