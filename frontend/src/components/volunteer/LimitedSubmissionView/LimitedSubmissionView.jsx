"use client"

import { useState, useEffect } from "react"
import api from "../../../services/api"
import GiveFeedback from "../GiveFeedback/GiveFeedback"
import InfoTooltip from "../../common/InfoTooltip/InfoTooltip"
import "./LimitedSubmissionView.css"

const LimitedSubmissionView = ({ participant }) => {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)

  useEffect(() => {
    if (participant) {
      fetchSubmissions()
    }
  }, [participant])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/submissions?userId=${participant.id}`)
      setSubmissions(response.data)
      setError(null)
    } catch (err) {
      setError("Failed to load submissions")
      console.error("Error fetching submissions:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleGiveFeedback = (submission) => {
    setSelectedSubmission(submission)
    setShowFeedbackForm(true)
  }

  const handleFeedbackSubmitted = () => {
    setShowFeedbackForm(false)
    setSelectedSubmission(null)
    fetchSubmissions()
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "reviewed":
        return "status-reviewed"
      case "pending":
        return "status-pending"
      case "needs_revision":
        return "status-revision"
      default:
        return ""
    }
  }

  if (loading) {
    return <div className="loading">Loading submissions...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (showFeedbackForm && selectedSubmission) {
    return (
      <GiveFeedback
        submission={selectedSubmission}
        onCancel={() => setShowFeedbackForm(false)}
        onSubmitted={handleFeedbackSubmitted}
      />
    )
  }

  return (
    <div className="limited-submission-view">
      <div className="view-header">
        <h2>
          Submissions for {participant.name}
          <InfoTooltip text="View participant submissions and provide feedback. Some details are restricted to admin access." />
        </h2>
        <p className="participant-email">{participant.email}</p>
      </div>

      {submissions.length === 0 ? (
        <div className="no-submissions">No submissions yet from this participant.</div>
      ) : (
        <div className="submissions-list">
          {submissions.map((submission) => (
            <div key={submission.id} className="submission-item">
              <div className="submission-header">
                <div>
                  <h3>{submission.assignment_title}</h3>
                  <p className="submission-date">Submitted: {new Date(submission.submitted_at).toLocaleDateString()}</p>
                </div>
                <span className={`status-badge ${getStatusBadgeClass(submission.status)}`}>
                  {submission.status.replace("_", " ")}
                </span>
              </div>

              <div className="submission-content">
                <div className="github-link">
                  <strong>GitHub URL:</strong>
                  <a href={submission.github_url} target="_blank" rel="noopener noreferrer" className="github-url">
                    {submission.github_url}
                  </a>
                </div>

                {submission.feedback && submission.feedback.length > 0 && (
                  <div className="existing-feedback">
                    <h4>Feedback History</h4>
                    {submission.feedback.map((fb) => (
                      <div key={fb.id} className="feedback-item">
                        <div className="feedback-header">
                          <span className="reviewer-name">{fb.reviewer_name}</span>
                          <span className="feedback-date">{new Date(fb.created_at).toLocaleDateString()}</span>
                        </div>
                        {fb.rating && <div className="feedback-rating">Rating: {"⭐".repeat(fb.rating)}</div>}
                        {fb.category && <div className="feedback-category">Category: {fb.category}</div>}
                        <p className="feedback-content">{fb.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button className="feedback-button" onClick={() => handleGiveFeedback(submission)}>
                Give Feedback
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default LimitedSubmissionView
