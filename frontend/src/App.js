import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchTokenAndConnect = async () => {
      try {
        console.log('Attempting to fetch token...');
        const response = await fetch('http://localhost:5000/negotiate', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        });
        
        if (!response.ok) {
          console.error('Response not OK:', response.statusText);
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Received tokenized URL from backend:', data.url);

        // Initialize Socket.IO connection with token
        const socketInstance = io('https://medtrainchatbot.webpubsub.azure.com', {
          path: "/clients/socketio/hubs/chat",
          transports: ['websocket'],  // Force WebSocket
          forceNew: true,  // Always create a new connection
          reconnection: true,  // Enable reconnection attempts
        });
        

        socketInstance.on('connect', () => {
          console.log('Connected to Azure Web PubSub using Socket.IO!');
        });

        socketInstance.on('message', (msg) => {
          console.log('Message received:', msg);
          setMessages((prevMessages) => [...prevMessages, msg]);
        });

        socketInstance.on('disconnect', () => {
          console.log('Disconnected from Azure Web PubSub');
        });

        socketInstance.on('error', (error) => {
          console.error('Socket.IO Error:', error);
        });

        setSocket(socketInstance);
      } catch (error) {
        console.error('Failed to fetch token or connect:', error);
      }
    };

    fetchTokenAndConnect();

    // Cleanup function to disconnect the socket when the component is unmounted
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const sendMessage = () => {
    if (socket) {
      socket.emit('message', { text: message });
      setMessage('');
    }
  };

  return (
    <div>
      <h1>React with Socket.IO and Azure Web PubSub!</h1>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div>
        <h2>Messages:</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
