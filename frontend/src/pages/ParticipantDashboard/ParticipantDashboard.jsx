"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { progressAPI } from "../../services/api"
import AssignmentList from "../../components/participant/AssignmentList/AssignmentList"
import ProgressTracker from "../../components/participant/ProgressTracker/ProgressTracker"
import "./ParticipantDashboard.css"

const ParticipantDashboard = () => {
  const { user } = useAuth()
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
  })

  useEffect(() => {
    fetchProgress()
  }, [user])

  const fetchProgress = async () => {
    try {
      setLoading(true)
      const response = await progressAPI.getByUserId(user.id)
      setProgress(response.data)

      // Calculate stats
      const total = response.data.length
      const completed = response.data.filter((p) => p.status === "completed").length
      const inProgress = response.data.filter((p) => p.status === "in_progress").length
      const notStarted = response.data.filter((p) => p.status === "not_started").length

      setStats({ total, completed, inProgress, notStarted })
    } catch (error) {
      console.error("Failed to fetch progress:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: "2rem", textAlign: "center" }}>
        Loading...
      </div>
    )
  }

  return (
    <div className="participant-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>My Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back, {user.name}!</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Assignments</div>
          </div>
          <div className="stat-card stat-success">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card stat-warning">
            <div className="stat-value">{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card stat-gray">
            <div className="stat-value">{stats.notStarted}</div>
            <div className="stat-label">Not Started</div>
          </div>
        </div>

        <ProgressTracker progress={progress} />

        <AssignmentList progress={progress} onUpdate={fetchProgress} />
      </div>
    </div>
  )
}

export default ParticipantDashboard
