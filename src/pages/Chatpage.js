import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { MessageBox, Input, Button } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import icon from '../images/icon.png';
import './ChatPage.css';
import axios from 'axios';

const fetcher = url => axios.get(url).then(res => res.data);

const ChatPage = () => {
  const [inputValue, setInputValue] = useState('');
  const userId = 2; 
  const userName = "You"; 

  const { data: messages, error } = useSWR('http://localhost:5500/chat', fetcher, {
    refreshInterval: 5000, 
    onErrorRetry: (error, key, option, revalidate, { retryCount }) => {
      if (error.status === 404) return; 
      if (retryCount >= 10) return; 
      setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 5000);
    }
  });

  if (error) console.error('Error fetching messages:', error);
  if (!messages) return <div>Loading...</div>; 
  const sendToServer = async (message) => {
    try {
      const response = await axios.post('http://localhost:5500/chat', {
        id: userId,
        username: userName,
        message
      });
      mutate('http://localhost:5500/chat', [...messages, ...response.data], false); // Optimistic UI update
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendToServer(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-appbar">
        <img src={icon} alt="Profile" className="profile-icon" />
        <span className="appbar-title">You</span>
      </div>
      <div className="chat-box">
        <div className="messages-list">
          {messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).map((message, index) => (
            <MessageBox
              key={index}
              position={message.username === userName ? "right" : "left"}
              type="text"
              text={message.message}
              avatar={icon}
              date={new Date(message.timestamp)}
              title={message.username}
              status="read"
              notch={true}
            />
          ))}
        </div>
        <Input
          inputStyle={{ backgroundColor: '#B3C2F1' }}
          placeholder="Type a message..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          rightButtons={
            <Button
              color="white"
              backgroundColor="#0084ff"
              text="Send"
              onClick={handleSendMessage}
            />
          }
          className="chat-input"
        />
      </div>
    </div>
  );
};

export default ChatPage;
