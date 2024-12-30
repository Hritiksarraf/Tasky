"use client";
import React, { useState } from "react";
import { DateTimePicker, renderTimeViewClock } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Slider from "@mui/material/Slider";

const AddTaskModal = ({ isEditMode, taskData, onClose, onSuccess, user }) => {
    const [title, setTitle] = useState(taskData?.title || "");
    const [priority, setPriority] = useState(taskData?.priority || 1);
    const [status, setStatus] = useState(taskData?.status || "pending");
    const [startTime, setStartTime] = useState(taskData?.startTime ? new Date(taskData.startTime) : null);
    const [endTime, setEndTime] = useState(taskData?.endTime ? new Date(taskData.endTime) : null);

    const validateFields = () => {
        if (!title || !startTime || !endTime || !status) {
            alert("Please fill in all required fields.");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateFields()) return;

        const userId = user.userid;
        try {
            const payload = {
                _id: taskData?._id || "12",
                title,
                priority,
                status,
                startTime,
                endTime,
                userId,
            };

            const url = isEditMode ? "/api/task/update" : "/api/task/add";
            const method = isEditMode ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const message = isEditMode ? "Task updated successfully" : "Task added successfully";
                alert(message);
                window.location.reload();
                
            } else {
                throw new Error("An error occurred while submitting the task");
            }
        } catch (error) {
            console.error("Error submitting task:", error);
            alert(error.message);
        }
    };

    const handlePriorityChange = (event, newValue) => setPriority(newValue);

    const getPriorityColor = (value) => {
        const green = 255 - (value - 1) * 50; // Gradual decrease in green
        return `rgb(255, ${green}, 0)`; // Red increases with value
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg w-96">
                    <h2 className="text-2xl font-semibold mb-4">
                        {isEditMode ? "Edit Task" : "Add New Task"}
                    </h2>

                    {/* Title Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="Enter task title"
                        />
                    </div>

                    {/* Priority Slider */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Priority</label>
                        <Slider
                            value={priority}
                            onChange={handlePriorityChange}
                            step={1}
                            min={1}
                            max={5}
                            valueLabelDisplay="auto"
                            sx={{
                                color: getPriorityColor(priority),
                            }}
                        />
                    </div>

                    {/* Status Radio Buttons */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Status</label>
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    value="pending"
                                    checked={status === "pending"}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="radio"
                                />
                                <span style={{ color: "green" }}>Pending</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    value="finished"
                                    checked={status === "finished"}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="radio"
                                />
                                <span style={{ color: "darkgreen" }}>Finished</span>
                            </label>
                        </div>
                    </div>

                    {/* Start Time */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Start Time</label>
                        <DateTimePicker
                            value={startTime}
                            onChange={(newValue) => setStartTime(newValue)}
                            renderInput={(params) => <input {...params} className="w-full border rounded px-3 py-2" />}
                            disablePast
                            viewRenderers={{
                                hours: renderTimeViewClock,
                                minutes: renderTimeViewClock,
                                seconds: renderTimeViewClock,
                            }}
                        />
                    </div>

                    {/* End Time */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">End Time</label>
                        <DateTimePicker
                            value={endTime}
                            onChange={(newValue) => setEndTime(newValue)}
                            renderInput={(params) => <input {...params} className="w-full border rounded px-3 py-2" />}
                            minDateTime={startTime || new Date()}
                            viewRenderers={{
                                hours: renderTimeViewClock,
                                minutes: renderTimeViewClock,
                                seconds: renderTimeViewClock,
                            }}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between">
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            {isEditMode ? "Update Task" : "Add Task"}
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </LocalizationProvider>
    );
};

export default AddTaskModal;
