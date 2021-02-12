import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat';
import Pusher from 'pusher-js';
import axios from './axios';

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:9000/messages/sync')
    .then(response => {
      console.log(response.data);
      setMessages(response.data);
    })
  }, [])

  // when function component loads, run the follow once
  useEffect(() => {
    const pusher = new Pusher('1693ef51485e86ca1e9f', {
      cluster: 'us2',
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage) => {
      alert(JSON.stringify(newMessage));
      setMessages([...messages, newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages])

  return (
    <div className="app">
      <div className="app_body">
        <Sidebar />
        <Chat messages={messages}/>
      </div>
    </div>
  );
}

export default App;
