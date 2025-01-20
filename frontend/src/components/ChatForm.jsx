import React from "react";
import { useRef } from "react";
import { FaArrowUp } from "react-icons/fa";

const ChatForm = ({
  setChatHistory,
  generateBotResponse,
  chatHistory,
  handleSave,
}) => {
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    const userMessage = inputRef.current.value.trim();

    if (!userMessage) return;
    setChatHistory((prev) => [...prev, { text: userMessage, role: "user" }]);
    inputRef.current.value = "";
    handleSave(userMessage, "user");
    generateBotResponse([...chatHistory, { text: userMessage, role: "user" }]);
  };
  return (
    <form className="chat-form" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        className="message-input"
        placeholder="Message..."
        required
      />
      <button type="submit">
        <FaArrowUp />
      </button>
    </form>
  );
};

export default ChatForm;
