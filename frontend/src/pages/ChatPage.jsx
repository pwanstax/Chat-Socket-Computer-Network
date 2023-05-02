import React, {useState, useEffect} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Config from "../assets/configs/configs.json";
import {dateDisplay} from "../utils/dateDisplay";
import ChatBox from "../components/ChatBox";
import ChatList from "../components/ChatList";
import AddChatRoom from "../components/AddChatRoom";
import Chats from "../components/Chats";

const ChatPage = () => {
  const [chatId, setChatId] = useState("");
  const [chatWith, setChatWith] = useState("");
  const [isAddingRoom, setAddingRoom] = useState(false);
  const user = localStorage.getItem("username");
  const userId = localStorage.getItem("user_id");

  const [chatList, setChatList] = useState([]);

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
      const res = await axios.get(
        `${Config.BACKEND_URL}/user/chatRooms/${userId}`,
        {
          withCredentials: true,
        }
      );
      setChatList(res.data.chats);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChatList();
    return;
  }, []);

  return (
    <div className="chatpage-container">
      <div className="chat-container">
        <ChatList
          userId={userId}
          chatId={chatId}
          setChatId={setChatId}
          setChatWith={setChatWith}
          chatList={chatList}
          setAddingRoom={setAddingRoom}
        />
        {isAddingRoom ? (
          <AddChatRoom
            userId={userId}
            setChatId={setChatId}
            setChatWith={setChatWith}
            fetchChatList={fetchChatList}
          />
        ) : (
          <ChatBox
            chatId={chatId}
            user={user}
            userId={userId}
            chatWith={chatWith}
          />
        )}

        <Chats
          userId={userId}
          setChatId={setChatId}
          setChatWith={setChatWith}
          fetchChatList={fetchChatList}
        />
      </div>
    </div>
  );
};

export default ChatPage;
