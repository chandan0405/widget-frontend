  // Path: C:\Users\Admin\Desktop\HITEK Chatbot\frontend\src\services\api.js

  import axios from 'axios';

  // const apiUrl = process.env.REACT_APP_API_URL;
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';

  export const createInteractionLog = async () => {
    const response = await axios.post(`${apiUrl}/api/interaction-logs`);
    return response.data;
  };

  export const sendMessage = async (interactionLogId, message, businessId) => {
    const response = await axios.post(`${apiUrl}/api/rep-chat`, { interactionLogId, message, businessId });
    return response.data;
  };

  export const setHandoverFlag = async (interactionLogId) => {
    await axios.post(`${apiUrl}/api/handover`, { interactionLogId });
  };

  export const fetchBusinessConfig = async (businessId) => {
    const response = await axios.get(`${apiUrl}/api/businesses/${businessId}`);
    return response.data;
  };

  export const fetchConversationHistory = async (interactionLogId) => {
    const response = await axios.get(`${apiUrl}/api/interaction-logs/${interactionLogId}`);
    return response.data;
  };

  export const sendRepMessage = async (interactionLogId, message) => {
    await axios.post(`${apiUrl}/api/rep-chat`, { interactionLogId, message });
  };

  // function to fetch all interaction logs
  export const fetchAllInteractionLogs = async () => {
    const response = await axios.get(`${apiUrl}/api/interaction-logs`);
    return response.data;
  };
