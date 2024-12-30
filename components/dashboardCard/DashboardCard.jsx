import React from 'react';
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingIcon from "@mui/icons-material/Pending";
import AccessTimeIcon from "@mui/icons-material/AccessTime";


export default function DashboardCard({ icon: Icon, value, label }) {
  return (
    <div className="p-3  md:w-1/4 w-1/2 h-60">
        <div className="flex flex-col gap-y-1 items-center justify-center shadow-2xl px-4 py-6 h-full rounded-lg">
        <Icon style={{ fontSize: '4rem' }} className="text-blue-500" />
            <h2 className="title-font font-medium text-3xl text-gray-900">{value}</h2>
            <p className="leading-relaxed">{label}</p>
        </div>
    </div>
  )
}
