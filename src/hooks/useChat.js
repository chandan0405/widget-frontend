// Path: C:\Users\Admin\Desktop\HITEK Chatbot\frontend\src\hooks\useChat.js

import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

export const useChat = (apiUrl, interactionLogId, initialMessages = []) => {
  const [messages, setMessages] = useState(initialMessages);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      console.log("Initializing WebSocket connection");
      socketRef.current = io(apiUrl);
    }

    const handleMessage = (data) => {
      console.log("Received message:", data);
      if (data.interactionLogId === interactionLogId) {
        setMessages((prevMessages) => {
          // Prevent duplicate messages
          if (prevMessages.some(msg => msg.timestamp === data.message.timestamp && msg.content === data.message.content)) {
            return prevMessages;
          }
          return [...prevMessages, data.message];
        });
      }
    };

    socketRef.current.on('receiveMessage', handleMessage);

    return () => {
      if (socketRef.current) {
        console.log("Removing receiveMessage event listener");
        socketRef.current.off('receiveMessage', handleMessage);
      }
    };
  }, [interactionLogId]);

  useEffect(() => {
    if (socketRef.current && interactionLogId) {
      console.log("Joining room:", interactionLogId);
      socketRef.current.emit('join', { interactionLogId });
    }
  }, [interactionLogId]);

  return { messages, setMessages, socket: socketRef.current };
};
