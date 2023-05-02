import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import axios from "axios";
import Config from "../assets/configs/configs.json";

const AddChatRoom = ({setChatId, setChatWith, fetchChatList}) => {
  const {register, handleSubmit, getValues} = useForm();
  const [selectedItems, setSelectedItems] = useState([]);
  const [users, setUsers] = useState([]);

  const onSubmit = async (data) => {
    await addThenShowDM(
      data.name,
      selectedItems.map((item) => item.id)
    );
    window.location.reload();
  };

  const handleSelectChange = async () => {
    const items = JSON.parse(getValues("items"));
    setSelectedItems([...selectedItems, items]);
  };

  const addThenShowDM = async (name, allowedUsers) => {
    const data = {
      allowedUsers: allowedUsers,
      name: name,
      type: "Group",
    };
    try {
      const res = await axios.post(`${Config.BACKEND_URL}/chat`, data, {
        withCredentials: true,
      });
      const {isExisted, chatID, name} = res.data;

      if (isExisted === true) {
        fetchChatList();
      }
      setChatId(chatID);
      setChatWith(name);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (username) => {
    setSelectedItems(selectedItems.filter((item) => item.name !== username));
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get(`${Config.BACKEND_URL}/users`, {
          withCredentials: true,
        });

        setUsers(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    getUsers();
  }, []);

  return (
    <div className="chatbox-container">
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "28px 48px",
          gap: "24px",
          position: "relative",
        }}
      >
        <h2
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Add Group Chat
        </h2>
        <label style={{display: "flex", gap: "24px", alignItems: "center"}}>
          Group name :
          <input
            style={{
              border: "1px solid grey",
              borderRadius: "6px",
              width: "fit-content",
              padding: "12px",
            }}
            type="text"
            {...register("name")}
          />
        </label>
        <label style={{display: "flex", gap: "24px", alignItems: "center"}}>
          Select users :
          <select
            style={{borderRadius: "6px"}}
            {...register("items", {
              onChange: handleSelectChange,
              multiple: true,
            })}
          >
            {users.map((user) => (
              <option
                key={user.username}
                value={JSON.stringify({id: user._id, name: user.username})}
              >
                {user.username}
              </option>
            ))}
          </select>
        </label>
        <label style={{display: "flex", gap: "8px", alignItems: "center"}}>
          Selected users :
          {selectedItems.length ? (
            selectedItems.map((each) => {
              return (
                <p
                  onClick={() => handleDelete(each.name)}
                  className="addComponent"
                >
                  {each.name}
                </p>
              );
            })
          ) : (
            <p className="no-chosen-user">No chosen user</p>
          )}
        </label>
        <button type="submit" style={{width: "95%", textAlign: "right"}}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddChatRoom;
