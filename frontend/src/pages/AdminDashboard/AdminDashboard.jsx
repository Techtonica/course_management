"use client"

import { useState } from "react"
import CourseManager from "../../components/admin/CourseManager/CourseManager"
import AssignmentManager from "../../components/admin/AssignmentManager/AssignmentManager"
import SubmissionReview from "../../components/admin/SubmissionReview/SubmissionReview"
import SurveyBuilder from "../../components/admin/SurveyBuilder/SurveyBuilder"
import UserManager from "../../components/admin/UserManager/UserManager"
import "./AdminDashboard.css"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("courses")

  const tabs = [
    { id: "courses", label: "Courses" },
    { id: "assignments", label: "Assignments" },
    { id: "submissions", label: "Submissions" },
    { id: "surveys", label: "Surveys" },
    { id: "users", label: "Users" },
  ]

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p className="dashboard-subtitle">Manage courses, assignments, and review submissions</p>
        </div>

        <div className="admin-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`admin-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="admin-content">
          {activeTab === "courses" && <CourseManager />}
          {activeTab === "assignments" && <AssignmentManager />}
          {activeTab === "submissions" && <SubmissionReview />}
          {activeTab === "surveys" && <SurveyBuilder />}
          {activeTab === "users" && <UserManager />}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
