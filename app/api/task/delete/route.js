import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Task from "@/lib/models/todo"; // Adjust the path if needed
import User from "@/lib/models/User"; // Import your user model
import { connectToDB } from "@/lib/mongodb/mongoose"; // Ensure you have a database connection utility

export async function DELETE(req) {
  try {
    // Parse the incoming request body
    const { _id, userId } = await req.json();

    // Validate required fields
    if (!_id || !userId) {
      return NextResponse.json(
        { error: "Task ID and User ID are required" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDB();

    // Delete the task from the Task collection
    const deletedTask = await Task.findByIdAndDelete(_id);
    if (!deletedTask) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    // Find the user and remove the task ID from their tasks array
    const userDoc = await User.findById(userId);
    if (!userDoc) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Remove the task ID from the user's tasks array
    userDoc.tasks = userDoc.tasks.filter((taskId) => taskId.toString() !== _id);
    await userDoc.save();

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the task" },
      { status: 500 }
    );
  }
}
