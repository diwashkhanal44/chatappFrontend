import React, { useState } from 'react';
import { MessageBox, Input, Button } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css'; 
import icon from '../images/icon.png'; 
import './ChatPage.css';
import axios from 'axios';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const sendToServer = async (message) => {
    try {
      const response = await axios.post('http://localhost:8080', { message });
      console.log('Message sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendToServer(inputValue);
      setMessages([...messages, {
        position: "right",
        type: "text",
        text: inputValue,
        avatar: icon,
        date: new Date(),
        title: "You"
      }]);
      setInputValue('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-appbar">
        <img src={icon} alt="Profile" className="profile-icon" />
        <span className="appbar-title">Liam</span>
      </div>
      <div className="chat-box">
        <div className="messages-list">
          {messages.map((message, index) => (
            <MessageBox
              key={index}
              position={message.position}
              type={message.type}
              text={message.text}
              avatar={icon}
              date={message.date}
              notch={true}
              title={message.title}
              status="read"
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
