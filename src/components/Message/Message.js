// Path: C:\Users\Admin\Desktop\HITEK Chatbot\frontend\src\components\Message\Message.js

import React from 'react';
import logo from '../../assets/logo.png'; // Ensure you have a logo.png in the assets folder
import './Chat.css';

const Message = ({ role, content, timestamp, businessName, businessLogo }) => {
  const isAssistant = role === 'assistant';
  const isRep = role === 'HITEK rep';
  
  return (
    <div className={`chat-message-container ${isAssistant ? 'assistant' : isRep ? 'rep' : 'user'}`}>
      {(isAssistant || isRep) && <img src={businessLogo} alt="Logo" className="ai-logo" />}
      <div className="message-wrapper">
        {(isAssistant || isRep) && (
          <div className="message-label">
            {role === 'assistant' ? `${businessName} Agent` : `${businessName} Rep`}
          </div>
        )}
        <div className={`chat-message ${isAssistant ? 'assistant' : isRep ? 'rep' : 'user'}`}>
          <span>{content}</span>
        </div>
        <div className={`timestamp ${isAssistant ? 'assistant' : isRep ? 'rep' : 'user'}`}>{timestamp}</div>
      </div>
    </div>
  );
};

export default Message;
