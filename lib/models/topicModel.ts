import mongoose, { Schema } from "mongoose";

const TopicSchema = new Schema({
  name: { type: String, required: true, maxlength: 100 },
});

// Check if the model already exists before creating it
const Topic = mongoose.models.Topic || mongoose.model("Topic", TopicSchema);

export default Topic;
