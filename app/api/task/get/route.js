import { NextResponse } from "next/server";
import Task from "@/lib/models/todo"; 
import User from "@/lib/models/User"; 
import { connectToDB } from "@/lib/mongodb/mongoose";


export async function POST(req) {
  try {
    await connectToDB();
    const { userid } = await req.json();

    
    const user = await User.findById(userid);


    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    
    const tasks = await Task.find({ _id: { $in: user.tasks } });

    
    const serializedTasks = tasks.map((task) => ({
      ...task.toObject(),
      _id: task._id.toString(), 
    }));

    return NextResponse.json(serializedTasks, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching tasks" },
      { status: 500 }
    );
  }
}
