// Path: C:\Users\Admin\Desktop\HITEK Chatbot\frontend\src\components\UserChat\UserChat.js

import React, { useState, useEffect } from 'react';
import { createInteractionLog, sendMessage, setHandoverFlag, fetchBusinessConfig } from '../../services/api';
import './UserChat.css';
import { useChat } from '../../hooks/useChat';
import Message from '../Message/Message';

// Helper function to get query parameters from URL
const useQuery = () => {
  return new URLSearchParams(window.location.search);
};

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const UserChat = () => {
  const query = useQuery();
  const businessId = query.get('businessId'); // Get the businessId from query parameters
  console.log("businessId", businessId)

  const [input, setInput] = useState('');
  const [interactionLogId, setInteractionLogId] = useState(localStorage.getItem('interactionLogId'));
  const [minimized, setMinimized] = useState(true);
  const [botActive, setBotActive] = useState(localStorage.getItem('botActive') !== 'false');
  const [businessConfig, setBusinessConfig] = useState({});
  const [error, setError] = useState(null); // To capture and display errors

  const initialMessages = JSON.parse(localStorage.getItem(`chatMessages_${interactionLogId}`)) || [];
  const { messages, setMessages, socket } = useChat(process.env.REACT_APP_API_URL, interactionLogId, initialMessages);
  console.log(process.env.REACT_APP_API_URL)
  useEffect(() => {
    const fetchConfig = async () => {
      if (businessId) {
        try {
          const config = await fetchBusinessConfig(businessId);
          setBusinessConfig(config);
        } catch (error) {
          console.error('Error fetching business config:', error);
          setError('Failed to fetch business configuration.');
        }
      }
    };

    fetchConfig();
  }, [businessId]);

  useEffect(() => {
    const initializeInteractionLog = async () => {
      try {
        const interactionLog = await createInteractionLog();
        const newInteractionLogId = interactionLog.id;
        localStorage.setItem('interactionLogId', newInteractionLogId);
        setInteractionLogId(newInteractionLogId);
        const welcomeMessage = {
          role: 'assistant',
          content: businessConfig.welcome_message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([welcomeMessage]);
        localStorage.setItem(`chatMessages_${newInteractionLogId}`, JSON.stringify([welcomeMessage]));
      } catch (error) {
        console.log('Error initializing interaction log:', error);
        setError('Failed to initialize interaction log.');
      }
    };

    if (!interactionLogId && businessConfig.welcome_message) {
      initializeInteractionLog();
    }
  }, [interactionLogId, businessConfig]);

  useEffect(() => {
    if (interactionLogId) {
      localStorage.setItem(`chatMessages_${interactionLogId}`, JSON.stringify(messages));
    }
  }, [messages, interactionLogId]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);

    try {
      socket.emit('sendMessage', { interactionLogId, message: userMessage, businessId });
      // socket.emit('sendMessage', { interactionLogId, message: userMessage });
      console.log('Sent message:', userMessage);

      if (botActive) {
        const response = await sendMessage(interactionLogId, input, businessId);
        const aiMessage = {
          role: 'assistant',
          content: response.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prevMessages => [...prevMessages, aiMessage]);
      }
    } catch (error) {
      console.log('Error sending message:', error);
      setError('Failed to send message.');
    }

    setInput('');
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleHumanHandover = async () => {
    const userMessage = {
      role: 'user',
      content: 'speak to representative',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    try {
      const response = await sendMessage(interactionLogId, 'speak to representative', businessId);
      const aiMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prevMessages => [...prevMessages, aiMessage]);

      await setHandoverFlag(interactionLogId);
      console.log("Handover flag set for interaction log:", interactionLogId);

      // Set bot as inactive
      setBotActive(false);
      localStorage.setItem('botActive', 'false');
    } catch (error) {
      console.log('Error sending message:', error);
      setError('Failed to send handover message.');
    }
  };

  const toggleMinimize = () => {
    setMinimized(!minimized);
  };

  return (
    <div className={`chat-widget ${minimized ? 'minimized' : ''}`}>
      <div className="chat-header" onClick={toggleMinimize}>
        <img src={businessConfig.logo_url} alt="Logo" className="chat-logo" /> {/* Use logo */}
      </div>
      {!minimized && (
        <>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <Message
                key={index}
                role={msg.role}
                content={msg.content}
                timestamp={msg.timestamp}
                businessName={businessConfig.name} // Pass business name
                businessLogo={businessConfig.logo_url} // Pass business logo
              />
            ))}
            {error && <div className="error-message">{error}</div>}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
            />
            <button className="send-button" onClick={handleSendMessage}>
              ➤
            </button>
          </div>
          <div className="request-support">
            <a href="#" onClick={handleHumanHandover}>Speak With Live Agent</a>
          </div>
        </>
      )}
    </div>
  );
};

export default UserChat;
