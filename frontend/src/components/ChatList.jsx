import React, {useEffect, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Config from "../assets/configs/configs.json";
import {dateDisplay} from "../utils/dateDisplay";

const ChatList = ({
  userId,
  chatId,
  setChatId,
  setChatWith,
  chatList,
  setAddingRoom,
}) => {
  const handleChoose = (chatId, chatWith, index) => {
    setAddingRoom(false);
    setChatWith(chatWith);
    setChatId(chatId);
  };

  return (
    <div className="chatlist-container">
      <div className="header">
        <h2>Chats</h2>
        <i onClick={() => setAddingRoom(true)} class="fa-solid fa-plus"></i>
      </div>
      <div className="chatlist">
        {chatList.length > 0 ? (
          <>
            {chatList.map((chat, index) => {
              const {_id, name, type} = chat;
              return (
                <div
                  className={`chat ${_id === chatId ? "selected" : ""}`}
                  key={_id}
                  onClick={() => handleChoose(_id, name, index)}
                >
                  <h3>{name}</h3>
                  {type === "Group" && <i class="fa-solid fa-user-group"></i>}
                </div>
              );
            })}
          </>
        ) : (
          <div className="no-chat">No Chat</div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
