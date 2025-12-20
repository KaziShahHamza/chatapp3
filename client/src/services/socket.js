// client/src/services/socket.js
import { io } from 'socket.io-client';

// Make sure this matches your backend URL exactly
const socket = io('http://localhost:5000', {
  withCredentials: true,
  autoConnect: true // Ensure it connects automatically
});

export default socket;