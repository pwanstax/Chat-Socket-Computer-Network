import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "can't be blank"],
    },
    nameForDirect: {
      type: String,
    },
    type: {
      type: String,
      required: [true, "can't be blank"],
      enum: ["Direct", "Group"],
    },
    allowedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {timestamps: true}
);
const Chat = mongoose.model("Chat", chatRoomSchema);
export default Chat;
