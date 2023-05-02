import express from "express";
import mongoose from "mongoose";
import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";

export const createChat = async (req, res, next) => {
  try {
    const {allowedUsers, name, type} = req.body;
    if (type === "Direct") {
      const existChat = await Chat.findOne({
        allowedUsers: {$all: allowedUsers},
        type: "Direct",
      });
      if (existChat != null) {
        return res
          .status(200)
          .json({isExisted: true, chatID: existChat._id, name: existChat.name});
      }
    }
    let chat = new Chat();

    if (name) chat.name = name;
    else chat.name = "";
    if (allowedUsers) chat.allowedUsers = allowedUsers;
    if (type) chat.type = type;
    await chat.save();
    // Add the new room to all allowed users' chatRooms
    await User.updateMany(
      {_id: {$in: allowedUsers}},
      {$addToSet: {chatRooms: chat._id}}
    );
    res.status(201).json({isExisted: false, chatID: chat._id, name: chat.name});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

export const getAllChatRooms = async (req, res, next) => {
  try {
    let chats = await Chat.find({type: "Group"});
    res.send(chats);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

export const joinChatRoom = async (req, res, next) => {
  const {chatID, userID} = req.body;
  try {
    const existChat = await Chat.findById(chatID);
    if (existChat == null) {
      return res.status(404).json({message: "Not found"});
    }

    const joinedChat = await Chat.findOne({
      _id: chatID,
      allowedUsers: {$in: [userID]},
    });
    if (joinedChat != null) {
      return res
        .status(200)
        .json({isJoined: true, chatID: chatID, name: joinedChat.name});
    }
    await Chat.findByIdAndUpdate(chatID, {$addToSet: {allowedUsers: userID}});
    await User.updateOne({_id: userID}, {$addToSet: {chatRooms: chatID}});
    return res
      .status(200)
      .json({isJoined: false, chatID: chatID, name: existChat.name});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

export const toggleNotiChat = async (req, res, next) => {
  const chat_id = req.headers.chat_id;
  const user_id = req.headers.user_id;
  let user;
  try {
    user = await User.findById(user_id);
    if (user == null) {
      return res.status(404).send({message: "Cannot find user"});
    }
  } catch (err) {
    return res.status(500).json({message: err.message});
  }
  const index = user.muteList.indexOf(chat_id);
  if (index !== -1) {
    user.muteList.splice(index, 1);
    res.send("Turn on notification for this chat");
  } else {
    user.muteList.push(chat_id);
    res.send("Turn off notification for this chat");
  }
  user.save();
};
