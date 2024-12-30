"use client";
import React, { useState, useEffect } from "react";
import TaskCard from "@/components/taskCard/TaskCard";
import AddTaskModal from "@/components/addTaskModal/AddTaskModal";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import Select from "react-select"; 

export default function Page() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [user, setUser] = useState({});
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [sortOptions, setSortOptions] = useState({
        startTime: "asc",
        endTime: "asc",
    });
    const [filters, setFilters] = useState({
        status: "",
        priority: "",
    });
    const [loading, setLoading] = useState(true); 
    const router = useRouter();

    // Only fetch data after the component has mounted (to avoid SSR issues with localStorage)
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedUser = jwt.decode(token);
            setUser(decodedUser);
            fetchTasks(decodedUser.userid);
        } else {
            router.push("/");
        }
        setLoading(false); 
    }, []);

    const fetchTasks = async (userid) => {
        try {
            const response = await fetch("/api/task/get", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userid: userid }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            setTasks(data); 
            setFilteredTasks(data); // Initialize filteredTasks with all tasks
        } catch (error) {
            console.error("Error fetching tasks:", error);
            alert("An error occurred while fetching tasks.");
        }
    };

    const handleAdd = () => {
        setEditTask(null);
        setModalOpen(true);
    };

    const handleSuccess = () => {
       
        fetchTasks(user.userid);
    };

    const handleSort = (field, order) => {
        setSortOptions((prev) => ({ ...prev, [field]: order }));
        const sortedTasks = [...filteredTasks].sort((a, b) => {
            const aDate = new Date(a[field]);
            const bDate = new Date(b[field]);
            if (order === "asc") return aDate - bDate;
            return bDate - aDate;
        });
        setFilteredTasks(sortedTasks);
    };

    const handleFilterChange = (type, value) => {
        setFilters((prev) => ({ ...prev, [type]: value }));
    };

    // Apply filters to tasks
    const filteredAndSortedTasks = filteredTasks.filter((task) => {
        const matchesStatus = filters.status ? task.status === filters.status : true;
        const matchesPriority = filters.priority ? task.priority === filters.priority : true;
        return matchesStatus && matchesPriority;
    });

    if (loading) {
        return <div>Loading...</div>; // Show loading indicator until the component has mounted
    }

    return (
        <div className="min-h-screen px-5 bg-gray-100 pt-32 py-10">
            <div className=" flex gap-y-3 flex-col-reverse md:flex-row mb-10 md:mx-16 md:flex justify-between">
                <div className="md:flex flex flex-col  space-x-4">
                    <button
                        onClick={handleAdd}
                        className="bg-blue-500 text-white px-4 py-3 rounded-md"
                    >
                        Add Task
                    </button>

                    <div className="flex space-x-4">
                        {/* Sort by Start Time */}

                    </div>
                </div>

                <div className="flex flex-wrap gap-y-1 space-x-4">
                    <div className="">
                        <Select
                            options={[
                                { value: "asc", label: " Ascending" },
                                { value: "desc", label: "Descending" },
                            ]}
                            value={{ value: sortOptions.startTime, label: `Start Time: ${sortOptions.startTime === "asc" ? "Ascending" : "Descending"}` }}
                            onChange={(e) => handleSort("startTime", e.value)}
                            className=" w-[40vw] md:w-60"
                        />
                    </div>

                    {/* Sort by End Time */}
                    <div>
                        <Select
                            options={[
                                { value: "asc", label: "Ascending" },
                                { value: "desc", label: "Descending" },
                            ]}
                            value={{ value: sortOptions.endTime, label: `End Time: ${sortOptions.endTime === "asc" ? "Ascending" : "Descending"}` }}
                            onChange={(e) => handleSort("endTime", e.value)}
                            className=" w-[40vw] md:w-60"
                        />
                    </div>
                    {/* Filter by Status */}
                    <div>
                        <Select
                            options={[
                                { value: "", label: "All Status" },
                                { value: "pending", label: "Pending" },
                                { value: "finished", label: "Finished" },
                            ]}
                            onChange={(e) => handleFilterChange("status", e.value)}
                            className=" w-[40vw] md:w-60"
                            placeholder="Status"
                        />
                    </div>

                    {/* Filter by Priority */}
                    <div>
                        <Select
                            options={[
                                { value: "", label: "All Priority" },
                                { value: 1, label: "1" },
                                { value: 2, label: "2" },
                                { value: 3, label: "3" },
                                { value: 4, label: "4" },
                                { value: 5, label: "5" },
                            ]}
                            onChange={(e) => handleFilterChange("priority", e.value)}
                            className=" w-[40vw] md:w-60"
                            placeholder="Priority"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap container mx-auto gap-6">
                {filteredAndSortedTasks.map((task) => (
                    <TaskCard key={task._id} {...task} user={user} />
                ))}
            </div>

            {isModalOpen && (
                <AddTaskModal
                    isEditMode={!!editTask}
                    taskData={editTask}
                    onClose={() => setModalOpen(false)}
                    onSuccess={handleSuccess}
                    user={user}
                />
            )}
        </div>
    );
}
