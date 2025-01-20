import React, { useEffect, useRef, useState } from "react";
import { TbMessageChatbot } from "react-icons/tb";

import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL  || "";
const App = () => {
  const [chatHistory, setChatHistory] = useState([]);
 
  const [error, setError] = useState(false);
  const [thinking, setThinking] = useState(false);
  const chatBodyRef = useRef();

  const handleSave = async (message, role) => {
    try {
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          role,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
      }
    } catch (error) {
      console.log(error?.message || "Something went wrong");
    }
  };
  const updateHistory = async (botResponse) => {
    setChatHistory((prev) => [...prev, { text: botResponse, role: "model" }]);
    try {
      await handleSave(botResponse, "model");
    } catch (error) {
      console.log(error?.message || "Something went wrong");
    }
  };
  const generateBotResponse = async (history) => {
    history = history.map(({ role, text }) => ({
      role,
      parts: [
        {
          text,
        },
      ],
    }));
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contents: history }),
    };

    try {
      setThinking(true);
      setError(false);
      const response = await fetch(
        import.meta.env.VITE_API_URL,
        requestOptions
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error.message || "Something went wrong");
      }

      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();

      console.log(apiResponseText);
      console.log(
        data.candidates[0].content.parts[0].text
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .trim()
      );
      updateHistory(apiResponseText);
    } catch (error) {
      console.error(error);
      setError(error?.message || "Something went wrong");
    } finally {
      setThinking(false);
    }
  };

  const fetchAllChats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getChats`);
      const data = await response.json();
     
      if (response.ok) {
        const chats = data?.data?.map((chat) => ({
          role: chat.role,
          text: chat.text,
          
        }));
     console.log(chats)
        setChatHistory(chats);
      }
    } catch (error) {
      console.log(error?.message || "Something went wrong");
    }
  };
  useEffect(() => {
    fetchAllChats();
  }, []);
  useEffect(() => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current?.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory.length]);
  return (
    <div className="container">
     
      {/* header  */}
      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <TbMessageChatbot
              onClick={() => setShowChatbot(false)}
              className="logo-icon"
            />
            <h2 className="logo-text">Chatbot</h2>
          </div>
         
        </div>

        {/* body  */}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <TbMessageChatbot />
            <p className="message-text">
              Hey there 👋 <br /> How can I help you today ?
            </p>
          </div>

          {chatHistory.length > 0 &&
            chatHistory.map((chat, index) => (
              <ChatMessage
                thinking={index === chatHistory.length - 1 && thinking}
                error={index === chatHistory.length - 1 && error}
                key={ index}
                {...chat}
              />
            ))}
        </div>
        {/* footer  */}
        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            handleSave={handleSave}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
