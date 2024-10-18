import React from 'react';
import ReactDOM from 'react-dom';
import UserChat from './components/UserChat/UserChat';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserChat />
  </React.StrictMode>,
  document.getElementById('chat-widget-root')
);
