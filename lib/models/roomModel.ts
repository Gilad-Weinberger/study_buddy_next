import mongoose, { Schema } from "mongoose";
import Topic from "./topicModel"; // Ensure this is correctly imported

const RoomSchema = new Schema(
  {
    name: { type: String, unique: true, maxlength: 200 },
    topics: [{ type: Schema.Types.ObjectId, ref: Topic, required: true }],
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    host: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

// Check if the model already exists before creating it
const Room = mongoose.models.Room || mongoose.model("Room", RoomSchema);

export default Room;
