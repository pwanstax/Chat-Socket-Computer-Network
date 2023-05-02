import React, {useEffect, useRef, useState} from "react";
import io from "socket.io-client";
import {encryptMessage, decryptMessage} from "../utils/message.js";
import Config from "../assets/configs/configs.json";

const ChatBox = ({chatId, user, userId, chatWith}) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.disconnect();
    }

    const newSocket = io(Config.BACKEND_URL, {
      query: {userId},
      withCredentials: true,
    });
    if (!!chatId) {
      console.log("====================================");
      console.log("in");
      console.log("====================================");
      setSocket(newSocket);
      newSocket.on("connect", () => {
        console.log(`Connected to server with socket ID: ${newSocket.id}`);
        newSocket.emit("join", {chatId, user});
      });
      newSocket.on("messages", (oldMessages) => {
        const decryptedOldMessages = oldMessages.map((message) => {
          if (message.systemMessage) {
            return message;
          }
          return {
            ...message,
            text: decryptMessage(message.text),
          };
        });
        setMessages(decryptedOldMessages);
      });
      newSocket.on("message", (newMessage) => {
        console.log(`Encrypted message received: ${newMessage.text}`);
        const decryptedMessage = decryptMessage(newMessage.text);
        setMessages((messages) => [
          ...messages,
          {...newMessage, text: decryptedMessage},
        ]);
      });
    }
  }, [chatId]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (socket && message) {
      const encryptedMessage = encryptMessage(message);
      socket.emit("message", {chatId, user, text: encryptedMessage});
      setMessage("");
    }
  };

  const dateDisplay = (dateInput) => {
    const date = new Date(dateInput);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const formattedDate = `${day >= 10 ? day : "0" + day}/${
      month >= 10 ? month : "0" + month
    } ${hour >= 10 ? hour : "0" + hour}:${
      minute >= 10 ? minute : "0" + minute
    }`;
    return formattedDate;
  };

  return (
    <div className="chatbox-container">
      {!!chatId && (
        <>
          <div className="header">
            <h2>{chatWith}</h2>
          </div>
          <div className="message-container">
            {[...messages].reverse().map((message, index) => {
              const prevMsg = [...messages].reverse()[index + 1];
              const isSameUser = prevMsg && prevMsg.user === message.user;
              return message.systemMessage ? (
                <div
                  className="system"
                  key={index}
                >{`- ${message.text} -`}</div>
              ) : (
                <div
                  className={`message ${
                    message.user !== user ? "left" : "right"
                  }`}
                  key={index}
                >
                  {message.user !== user && !isSameUser && (
                    <div className="username">{message.user}</div>
                  )}
                  <div
                    className={`text-time ${
                      message.user !== user ? "left" : "right"
                    }`}
                  >
                    <div className="text">{message.text}</div>
                    <div className="time">{dateDisplay(message.createdAt)}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={message}
              placeholder="Message..."
              onChange={(event) => setMessage(event.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatBox;
