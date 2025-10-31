"use client"

import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import Navbar from "../../components/common/Navbar/Navbar"
import ParticipantList from "../../components/volunteer/ParticipantList/ParticipantList"
import LimitedSubmissionView from "../../components/volunteer/LimitedSubmissionView/LimitedSubmissionView"
import "./VolunteerDashboard.css"

const VolunteerDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("participants")
  const [selectedParticipant, setSelectedParticipant] = useState(null)

  const handleViewSubmissions = (participant) => {
    setSelectedParticipant(participant)
    setActiveTab("submissions")
  }

  return (
    <div className="volunteer-dashboard">
      <Navbar />
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Volunteer Dashboard</h1>
          <p>Welcome back, {user?.name}</p>
        </header>

        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === "participants" ? "active" : ""}`}
            onClick={() => setActiveTab("participants")}
          >
            Participants
          </button>
          <button
            className={`tab-button ${activeTab === "submissions" ? "active" : ""}`}
            onClick={() => setActiveTab("submissions")}
            disabled={!selectedParticipant}
          >
            Submissions {selectedParticipant && `- ${selectedParticipant.name}`}
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === "participants" && <ParticipantList onViewSubmissions={handleViewSubmissions} />}
          {activeTab === "submissions" && selectedParticipant && (
            <LimitedSubmissionView participant={selectedParticipant} />
          )}
        </div>
      </div>
    </div>
  )
}

export default VolunteerDashboard
