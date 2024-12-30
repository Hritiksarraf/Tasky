import { NextResponse } from "next/server";
import Task from "@/lib/models/todo"; // Adjust path to your model
import { connectToDB } from "@/lib/mongodb/mongoose"; // Ensure DB connection

export async function PUT(req) {
    try {
        await connectToDB();

        const { _id, title, priority, status, startTime, endTime } = await req.json();

        if (!_id || !title || !priority || !status || !startTime) {
            return NextResponse.json(
                { error: "All fields are required, including the task ID" },
                { status: 400 }
            );
        }

        const taskUpdate = {
            title,
            priority,
            status,
            startTime,
            endTime: status === "finished" ? new Date() : endTime,
        };

        const updatedTask = await Task.findByIdAndUpdate(_id, taskUpdate, { new: true });

        if (!updatedTask) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedTask, { status: 200 });
    } catch (error) {
        console.error("Error updating task:", error);
        return NextResponse.json(
            { error: "An error occurred while updating the task" },
            { status: 500 }
        );
    }
}
