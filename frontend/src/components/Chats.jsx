import React, {useEffect, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Config from "../assets/configs/configs.json";

const Chats = ({userId, setChatId, setChatWith, fetchChatList}) => {
  const [chatList, setChatList] = useState([]);
  const [chatRoomList, setChatRoomList] = useState([]);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(`${Config.BACKEND_URL}/csrf-token`, {
          withCredentials: true,
        });
        Cookies.set("csrf-token", response.data.token);
      } catch (error) {
        console.error("Failed to fetch CSRF token", error);
      }
    };

    const fetchChatList = async () => {
      await fetchCsrfToken();
      try {
        const res = await axios.get(`${Config.BACKEND_URL}/users`, {
          withCredentials: true,
        });
        setChatList(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchChatRoomList = async () => {
      await fetchCsrfToken();
      try {
        const res = await axios.get(`${Config.BACKEND_URL}/chats`, {
          withCredentials: true,
        });
        setChatRoomList(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChatList();
    fetchChatRoomList();
    return;
  }, []);

  const addThenShowDM = async (id1, id2, username) => {
    const data = {
      allowedUsers: [id1, id2],
      name: `${id1} - ${id2}`,
      type: "Direct",
    };
    try {
      const res = await axios.post(`${Config.BACKEND_URL}/chat`, data, {
        withCredentials: true,
      });
      const {isExisted, chatID, name} = res.data;

      if (isExisted === false) {
        fetchChatList();
      }
      setChatId(chatID);
      setChatWith(username);
    } catch (error) {
      console.error(error);
    }
  };

  const joinThenShowChatRoom = async (userID, chatID) => {
    const data = {
      chatID,
      userID,
    };
    try {
      const res = await axios.patch(`${Config.BACKEND_URL}/chat/join`, data, {
        withCredentials: true,
      });
      const {isJoined, chatID, name} = res.data;

      if (isJoined === false) {
        fetchChatList();
      }
      setChatId(chatID);
      setChatWith(name);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="chatlist-container">
      {/* <div className="header">
        <h2>All Chats</h2>
      </div> */}
      <div className="chatlist">
        <div className="sub-header">
          <p>Users - {chatList.length}</p>
        </div>
        {chatList.length > 0 ? (
          <>
            {chatList.map((chat, index) => {
              const {_id, username} = chat;
              return (
                <div className="chat-dm" key={_id}>
                  <h3>{username}</h3>
                  {_id !== userId && (
                    <i
                      className="fa-solid fa-paper-plane"
                      onClick={() => addThenShowDM(userId, _id, username)}
                    ></i>
                  )}
                </div>
              );
            })}
          </>
        ) : (
          <div className="no-chat"></div>
        )}
        <div className="sub-header">
          <p>Chat rooms - {chatRoomList.length}</p>
        </div>
        {chatRoomList.length > 0 ? (
          <>
            {chatRoomList.map((chat, index) => {
              const {_id, name} = chat;
              return (
                <div className="chat-dm" key={_id}>
                  <h3>{name}</h3>
                  <i
                    className="fa-solid fa-paper-plane"
                    onClick={() => joinThenShowChatRoom(userId, _id)}
                  ></i>
                </div>
              );
            })}
          </>
        ) : (
          <div className="no-chat"></div>
        )}
      </div>
    </div>
  );
};

export default Chats;
