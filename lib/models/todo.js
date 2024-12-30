import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    required: true,
  },
  startTime:{
    type:Date,
    require : true,
  },
  endTime:{
    type:Date,
    require : true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);

export default Task;
