import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
  },
  { timestamps: true },
);

// Check if the model already exists before creating it
const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);

export default Message;
