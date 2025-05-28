import React, { useState, useRef, useEffect, useContext } from 'react';
import defaultAvatar from '../assets/dashboard/dashboard-user-avatar.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/AuthContext';

const apiUrl = import.meta.env.VITE_API_URL;

const Messages = () => {
  const { user } = useContext(AuthContext);

  const [students, setStudents] = useState([]); // students = users who sent requests
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const messagesEndRef = useRef(null);

  // Fetch active conversations on load
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        if (!user?.token) return;
        const response = await fetch(`${apiUrl}/api/protected/user/mentor/conversations`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch conversations');
        const data = await response.json();
        const activeStudents = (data.conversations || [])
          .filter((conv) => conv.isActive && conv.user)
          .map((conv) => ({
            id: conv.user.id,
            name: conv.user.name,
            profileImage: conv.user.profileImage,
            conversationId: conv.conversationId,
            lastMessage: conv.lastMessage ? conv.lastMessage.content : '',
            timestamp:
              conv.lastMessage && conv.lastMessage.createdAt
                ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })
                : '',
          }));
        setStudents(activeStudents);
        if (activeStudents.length > 0) {
          setSelectedStudent(activeStudents[0]);
          // Fetch messages for the first student
          const firstStudent = activeStudents[0];
          const res = await fetch(
            `${apiUrl}/api/protected/user/mentor/messages?conversationId=${firstStudent.conversationId}`,
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

  const handleStudentSelect = async (student) => {
    setSelectedStudent(student);
    try {
      const res = await fetch(
        `${apiUrl}/api/protected/user/mentor/messages?conversationId=${student.conversationId}`,
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
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !selectedStudent) return;
    try {
      const res = await fetch(`${apiUrl}/api/protected/user/mentor/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          content: newMessage,
          conversationId: selectedStudent.conversationId,
          userId: selectedStudent.id,
        }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Failed to send message:', errorText);
        return;
      }
      const data = await res.json();
      const savedMessage = data.message;
      setMessages([...messages, savedMessage]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="messages">
      {/* Left Part - Student List */}
      <div className="left-part-messages">
        <div className="mentor-dropdown">
          <select id="mentor-select" className="mentor-select" disabled>
            <option>My Students</option>
          </select>
        </div>

        {/* List of Students */}
        <div className="mentor-list">
          {students.map((student) => (
            <div
              key={student.id}
              className={`mentor-item ${
                selectedStudent && student.id === selectedStudent.id ? 'mentor-item-selected' : ''
              }`}
              onClick={() => handleStudentSelect(student)}
            >
              <img src={student.profileImage || defaultAvatar} alt="Student Avatar" className="mentor-avatar" />
              <div className="mentor-info">
                <div className="mentor-name">{student.name}</div>
                <div className="mentor-meta">
                  <span className="mentor-last-message">{student.lastMessage || ''}</span>
                  <span className="mentor-timestamp">{student.timestamp || ''}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Box */}
      <div className="chat-box">
        <div className="chat-header">
          <img src={selectedStudent?.profileImage || defaultAvatar} alt="Student Avatar" className="chat-mentor-avatar" />
          <div className="chat-mentor-details">
            <div className="chat-mentor-name">{selectedStudent?.name || ''}</div>
          </div>
        </div>
        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`chat-message ${
                message.sender.role === 'Mentor' ? 'chat-message-sender' : 'chat-message-receiver'
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