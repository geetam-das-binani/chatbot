import React from "react";
import { TbMessageChatbot } from "react-icons/tb";
const ChatMessage = ({ role, text, thinking, error }) => {
  return (
    <>
      <div className={`message ${role === "model" ? "bot" : "user"}-message`}>
        {role === "model" && <TbMessageChatbot />}
        <p className="message-text">{text}</p>
      </div>
      {thinking && !error && (
        <div className="bot-think-message">Thinking ...</div>
      )}
      {error && <div className="bot-think-message error">{error}</div>}
    </>
  );
};

export default ChatMessage;
