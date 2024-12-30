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

    
    const currentTime = new Date();

   
    const totalTasks = serializedTasks.length;
    const completedTasks = serializedTasks.filter((task) => task.status === "finished");
    const pendingTasks = serializedTasks.filter((task) => task.status !== "finished");

    // Total task summary
    const completedPercentage = totalTasks
      ? Math.round((completedTasks.length / totalTasks) * 100)
      : 0;

    const avgTimePerCompletedTask = completedTasks.length
      ? completedTasks.reduce((acc, task) => {
          const startTime = new Date(task.startTime);
          const endTime = new Date(task.endTime);
          return acc + (endTime - startTime) / (1000 * 60 * 60); 
        }, 0) / completedTasks.length
      : 0;

    // Pending task summary
    const totalPendingTasks = pendingTasks.length;
    const totalTimeLapsed = pendingTasks.reduce((acc, task) => {
      const startTime = new Date(task.startTime);
      return currentTime > startTime ? acc + (currentTime - startTime) / (1000 * 60 * 60) : acc;
    }, 0);

    const totalEstimatedTime = pendingTasks.reduce((acc, task) => {
      const endTime = new Date(task.endTime);
      return currentTime < endTime ? acc + (endTime - currentTime) / (1000 * 60 * 60) : acc;
    }, 0);

    // Priority-level summary
    const prioritySummary = [1, 2, 3, 4, 5].map((priority) => {
      const tasksAtPriority = pendingTasks.filter((task) => task.priority === priority);

      const tasksCount = tasksAtPriority.length;
      const timeLapsed = tasksAtPriority.reduce((acc, task) => {
        const startTime = new Date(task.startTime);
        return currentTime > startTime ? acc + (currentTime - startTime) / (1000 * 60 * 60) : acc;
      }, 0);

      const timeToFinish = tasksAtPriority.reduce((acc, task) => {
        const endTime = new Date(task.endTime);
        return currentTime < endTime ? acc + (endTime - currentTime) / (1000 * 60 * 60) : acc;
      }, 0);

      return {
        priority,
        pendingTasks: tasksCount,
        timeLapsed: timeLapsed.toFixed(2),
        timeToFinish: timeToFinish.toFixed(2),
      };
    });

    // Response object
    const response = {
      totalSummary: {
        totalTasks,
        completedPercentage,
        avgTimePerCompletedTask: avgTimePerCompletedTask.toFixed(2),
      },
      pendingSummary: {
        totalPendingTasks,
        totalTimeLapsed: totalTimeLapsed.toFixed(2),
        totalEstimatedTime: totalEstimatedTime.toFixed(2),
      },
      prioritySummary,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching task stats:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching task stats" },
      { status: 500 }
    );
  }
}
