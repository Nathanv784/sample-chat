import { useEffect, useRef, useState, useCallback } from 'react';
url="http://localhost:5000/negotiate"
const useWebSocket = (url) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    console.log("Attempting to establish WebSocket connection...");

    const connectWebSocket = async () => {
      try {
        console.log('Fetching token...');
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors',
        });

        if (!response.ok) {
          console.error('Failed to fetch WebSocket token:', response.statusText);
          throw new Error('Network response was not ok');
        }

        const { url: wsUrl } = await response.json();
        console.log('Token received, connecting to:', wsUrl);

        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
          console.log('WebSocket Connected');
        };

        ws.onerror = (error) => {
          console.error('WebSocket Error:', error);
        };

        ws.onmessage = (event) => {
          console.log('WebSocket Message Received:', event.data);
          try {
            const message = JSON.parse(event.data);
            setMessages(prev => [...prev, message]);
            console.log('Parsed Message:', message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        ws.onclose = (event) => {
          console.log('WebSocket Disconnected:', event.reason);
        };

      } catch (error) {
        console.error('WebSocket setup failed:', error);
      }
    };

    connectWebSocket();

    return () => {
      if (socketRef.current) {
        console.log('Closing WebSocket...');
        socketRef.current.close();
      }
    };
  }, [url]);

  const sendMessage = useCallback((message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log('Sending message:', message);
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.log('Attempted to send message, but WebSocket is not open.');
    }
  }, []);

  return [messages, sendMessage];
};

export default useWebSocket;
