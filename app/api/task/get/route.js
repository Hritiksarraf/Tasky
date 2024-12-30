import { NextResponse } from "next/server";
import Task from "@/lib/models/todo"; // Adjust the path if needed
import User from "@/lib/models/User"; // Adjust the path if needed
import { connectToDB } from "@/lib/mongodb/mongoose";


export async function POST(req) {
  try {
    await connectToDB();
    const { userid } = await req.json();

    // Fetch the user document based on the userid
    const user = await User.findById(userid);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Populate the tasks array from the Task collection
    const tasks = await Task.find({ _id: { $in: user.tasks } });

    // Convert the MongoDB documents to plain JavaScript objects
    const serializedTasks = tasks.map((task) => ({
      ...task.toObject(),
      _id: task._id.toString(), 
    }));

    // Return the tasks associated with the user
    return NextResponse.json(serializedTasks, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching tasks" },
      { status: 500 }
    );
  }
}
