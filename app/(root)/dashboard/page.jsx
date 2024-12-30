'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken"; // Ensure jwt is installed
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingIcon from "@mui/icons-material/Pending";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DashboardCard from "@/components/dashboardCard/DashboardCard";

export default function Page() {
  const [summaryData, setSummaryData] = useState([]);
  const [pendingData, setPendingData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchTasks = async (userid) => {
    try {
      const response = await fetch("/api/getStats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)

        // Process data for rendering
        setSummaryData([
          { icon: AssignmentIcon, value: data.totalSummary.totalTasks, label: "Total Task" },
          {
            icon: CheckCircleOutlineIcon,
            value: `${data.totalSummary.completedPercentage}%`,
            label: "Task Completed",
          },
          { icon: PendingIcon, value: `${100-(data.totalSummary.completedPercentage)}%`, label: "Task Pending" },
          {
            icon: AccessTimeIcon,
            value: `${data.totalSummary.avgTimePerCompletedTask} hrs`,
            label: "Average Time",
          },
        ]);

        setPendingData([
          { icon: AssignmentIcon, value: data.pendingSummary.totalPendingTasks, label: "Pending Tasks" },
          {
            icon: CheckCircleOutlineIcon,
            value: `${data.pendingSummary.totalTimeLapsed} hrs`,
            label: "Total Time Lapsed",
          },
          {
            icon: PendingIcon,
            value: `${data.pendingSummary.totalEstimatedTime} hrs`,
            label: "Estimated Time to Finish",
          },
        ]);

        setPriorityData(data.prioritySummary);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to fetch task stats");
      }
    } catch (err) {
      setError("An error occurred while fetching task stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedUser = jwt.decode(token);
      if (decodedUser?.userid) {
        fetchTasks(decodedUser.userid);
      } else {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="pt-20 bg-gray-100">
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-5 mx-auto">
         
          <h1 className="font-semibold  text-4xl mb-4">Summary</h1>
          <div className="flex flex-wrap items-center justify-center -m-4 text-center">
            {summaryData.map((item, index) => (
              <DashboardCard
                key={index}
                icon={item.icon}
                value={item.value}
                label={item.label}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font">
        <div className="container px-5 py-8 mx-auto">
          <h1 className="font-semibold  text-3xl mb-8">Pending Task Summary</h1>
          <div className="flex flex-wrap items-center  -m-4 text-center">
            {pendingData.map((item, index) => (
              <DashboardCard
                key={index}
                icon={item.icon}
                value={item.value}
                label={item.label}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font pb-40">
  <div className="container px-5 py-5 mx-auto">
    <h1 className="font-semibold text-4xl mb-6">Priority Task Summary</h1>
    <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
      <table className="min-w-full text-sm text-left text-gray-500">
        <thead className="bg-gray-100 text-gray-600 uppercase">
          <tr>
            <th className="px-4 py-3 font-semibold">Priority</th>
            <th className="px-4 py-3 font-semibold">Pending Tasks</th>
            <th className="px-4 py-3 font-semibold">Time Lapsed (hrs)</th>
            <th className="px-4 py-3 font-semibold">Time to Finish (hrs)</th>
          </tr>
        </thead>
        <tbody>
          {priorityData.map((priority, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">{`Priority ${priority.priority}`}</td>
              <td className="px-4 py-3">{priority.pendingTasks} tasks</td>
              <td className="px-4 py-3">{priority.timeLapsed} hrs</td>
              <td className="px-4 py-3">{priority.timeToFinish} hrs</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</section>
    </div>
  );
}
