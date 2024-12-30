import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Task from "@/lib/models/todo"; // Adjust the path if needed
import User from "@/lib/models/User"; // Import your user model
import { connectToDB } from "@/lib/mongodb/mongoose"; // Ensure you have a database connection utility

// Database connection (if not already implemented)
await connectToDB();

export async function POST(req) {
  try {
    // Parse the incoming request body
    const data = await req.json();

    // Validate required fields
    const { title, status, priority, startTime, endTime, userId } = data;
    console.log(title, status, priority, startTime, endTime, userId )
    if (!title || !status || !priority || !startTime || !endTime || !userId) {
      return NextResponse.json(
        { error: "All fields are required, including userId" },
        { status: 400 }
      );
    }

    // Create a new task
    const newTask = new Task({
      title,
      status,
      priority,
      startTime,
      endTime,
    });

    // Save the task to the database
    const savedTask = await newTask.save();

    // Find the user by ID and add the task ID to their tasks array
    const userDoc = await User.findById(userId);
    if (!userDoc) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Use the correct field name (tasks)
    userDoc.tasks.push(savedTask._id);
    await userDoc.save();

    return NextResponse.json(savedTask, { status: 201 });
  } catch (error) {
    console.error("Error adding task:", error);
    return NextResponse.json(
      { error: "An error occurred while adding the task" },
      { status: 500 }
    );
  }
}
