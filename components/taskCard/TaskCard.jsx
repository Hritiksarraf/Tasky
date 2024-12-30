'use client';

import React, { useState } from 'react';
import AddTaskModal from '@/components/addTaskModal/AddTaskModal'; // Adjust the path as needed
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'; // Adjusted for Heroicons v2
import axios from 'axios';

export default function TaskCard({
    title,
    status,
    priority,
    startTime,
    endTime,
    _id,
    onTaskUpdate,
    user
}) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Format date and time
    const formatDateTime = (dateTime) => {
        const options = { 
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', 
            hour: '2-digit', minute: '2-digit', hour12: true 
        };
        return new Date(dateTime).toLocaleDateString('en-US', options);
    };

    // Handle Edit button click
    const handleEdit = () => {
        setIsEditModalOpen(true);
    };

    // Handle Delete button click
    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/task/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ _id, userId: user.userid }), // Include user ID
            });
    
            if (response.ok) {
                const data = await response.json();
                alert("Task deleted successfully!");
                onTaskUpdate(); // Refresh the tasks list
            } else {
                const errorData = await response.json();
                alert(`Failed to delete task: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("Failed to delete task. Please try again.");
        }
    };

    return (
        <div className="flex flex-col p-6 bg-white rounded-lg shadow-md w-full max-w-md">
            {/* Task ID */}
            <p className="text-xs text-gray-400 mb-2">
                Task ID: {_id}
            </p>

            {/* Task Title */}
            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>

            {/* Task Status and Priority in a Row */}
            <div className="flex items-center justify-between space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                    <span
                        className={`font-medium px-2 py-1 rounded-lg ${
                            status === 'finished' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                        }`}
                    >
                        {status === 'finished' ? (
                            <span className="flex items-center">
                                <svg className="h-5 w-5 mr-1 text-green-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0 2a10 10 0 110-20 10 10 0 010 20z" clipRule="evenodd" />
                                </svg>
                                Finished
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <svg className="h-5 w-5 mr-1 text-red-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0 2a10 10 0 110-20 10 10 0 010 20z" clipRule="evenodd" />
                                </svg>
                                Pending
                            </span>
                        )}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`font-bold px-2 py-1 rounded-lg text-sm text-white ${priority==5? 'bg-red-800' :priority==4? 'bg-red-400':priority==3? 'bg-yellow-800':priority==2? 'bg-green-900' :'bg-green-600'}`}>
                    Priority: {priority}
                    </span>
                </div>
            </div>

            {/* Task Details */}
            <div className="text-sm text-gray-600 mb-4 space-y-1">
                <p className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="font-semibold">Start Time: </span>
                    <span className="ml-2">{formatDateTime(startTime)}</span>
                </p>
                <p className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="font-semibold">End Time: </span>
                    <span className="ml-2">{formatDateTime(endTime)}</span>
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
                <button
                    onClick={handleEdit}
                    className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                >
                    Edit
                </button>
                <button
                    onClick={handleDelete}
                    className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md"
                >
                    Delete
                </button>
            </div>

            {/* AddTaskModal for editing */}
            {isEditModalOpen && (
                <AddTaskModal
                    isEditMode={true}
                    taskData={{
                        title,
                        status,
                        priority,
                        startTime,
                        endTime,
                        _id,
                    }}
                    user
                    onClose={() => setIsEditModalOpen(false)}
                    onSuccess={() => {
                        setIsEditModalOpen(false);
                        onTaskUpdate(); // Refresh the tasks list
                    }}
                />
            )}
        </div>
    );
}
