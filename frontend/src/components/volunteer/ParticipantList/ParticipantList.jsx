"use client"

import { useState, useEffect } from "react"
import api from "../../../services/api"
import ProgressIndicator from "../../common/ProgressIndicator/ProgressIndicator"
import InfoTooltip from "../../common/InfoTooltip/InfoTooltip"
import "./ParticipantList.css"

const ParticipantList = ({ onViewSubmissions }) => {
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchParticipants()
  }, [])

  const fetchParticipants = async () => {
    try {
      setLoading(true)
      const response = await api.get("/users?role=participant")

      // Fetch progress for each participant
      const participantsWithProgress = await Promise.all(
        response.data.map(async (participant) => {
          try {
            const progressResponse = await api.get(`/progress/${participant.id}`)
            return {
              ...participant,
              progress: progressResponse.data,
            }
          } catch (err) {
            return {
              ...participant,
              progress: [],
            }
          }
        }),
      )

      setParticipants(participantsWithProgress)
      setError(null)
    } catch (err) {
      setError("Failed to load participants")
      console.error("Error fetching participants:", err)
    } finally {
      setLoading(false)
    }
  }

  const calculateProgress = (progress) => {
    if (!progress || progress.length === 0) return 0
    const completed = progress.filter((p) => p.status === "completed").length
    return Math.round((completed / progress.length) * 100)
  }

  const filteredParticipants = participants.filter(
    (participant) =>
      participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return <div className="loading">Loading participants...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <div className="participant-list">
      <div className="list-header">
        <h2>
          All Participants
          <InfoTooltip text="View all participants with limited access to their progress and submissions" />
        </h2>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="participants-grid">
        {filteredParticipants.map((participant) => {
          const progressPercentage = calculateProgress(participant.progress)
          const completedCount = participant.progress?.filter((p) => p.status === "completed").length || 0
          const totalCount = participant.progress?.length || 0

          return (
            <div key={participant.id} className="participant-card">
              <div className="participant-header">
                <img
                  src={participant.avatar_url || "/default-avatar.png"}
                  alt={participant.name}
                  className="participant-avatar"
                />
                <div className="participant-info">
                  <h3>{participant.name}</h3>
                  <p className="participant-email">{participant.email}</p>
                </div>
              </div>

              <div className="participant-progress">
                <div className="progress-label">
                  <span>Progress</span>
                  <span className="progress-count">
                    {completedCount}/{totalCount}
                  </span>
                </div>
                <ProgressIndicator percentage={progressPercentage} />
              </div>

              <button className="view-button" onClick={() => onViewSubmissions(participant)}>
                View Submissions
              </button>
            </div>
          )
        })}
      </div>

      {filteredParticipants.length === 0 && (
        <div className="no-results">No participants found matching "{searchTerm}"</div>
      )}
    </div>
  )
}

export default ParticipantList
