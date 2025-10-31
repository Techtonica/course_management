"use client"

import { useState, useEffect } from "react"
import { submissionsAPI, exportAPI } from "../../../services/api"
import Button from "../../common/Button/Button"
import FeedbackForm from "../FeedbackForm"
import "./SubmissionReview.css"

const SubmissionReview = () => {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState(null)

  useEffect(() => {
    fetchSubmissions()
  }, [filter])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const filters = filter !== "all" ? { status: filter } : {}
      const response = await submissionsAPI.getAll(filters)
      setSubmissions(response.data)
    } catch (error) {
      console.error("Failed to fetch submissions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const filters = filter !== "all" ? { status: filter } : {}
      const response = await exportAPI.submissions(filters)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `submissions_${filter}_${new Date().toISOString().split("T")[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error("Failed to export submissions:", error)
      alert("Failed to export submissions")
    }
  }

  const handleGiveFeedback = (submission) => {
    setSelectedSubmission(submission)
    setShowFeedbackForm(true)
  }

  if (loading) {
    return <div>Loading submissions...</div>
  }

  return (
    <div className="submission-review">
      <div className="manager-header">
        <h2>Submission Review</h2>
        <Button variant="accent" onClick={handleExport}>
          Export to CSV
        </Button>
      </div>

      <div className="submission-filters">
        <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
          All Submissions
        </button>
        <button className={`filter-btn ${filter === "pending" ? "active" : ""}`} onClick={() => setFilter("pending")}>
          Pending Review
        </button>
        <button className={`filter-btn ${filter === "reviewed" ? "active" : ""}`} onClick={() => setFilter("reviewed")}>
          Reviewed
        </button>
        <button
          className={`filter-btn ${filter === "needs_revision" ? "active" : ""}`}
          onClick={() => setFilter("needs_revision")}
        >
          Needs Revision
        </button>
      </div>

      <div className="submission-table-container">
        {submissions.length === 0 ? (
          <div className="empty-state">No submissions found for this filter.</div>
        ) : (
          <table className="submission-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Assignment</th>
                <th>GitHub URL</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id}>
                  <td>
                    <div className="student-info">
                      <strong>{submission.user_name}</strong>
                      <span className="student-username">@{submission.github_username}</span>
                    </div>
                  </td>
                  <td>{submission.course_title}</td>
                  <td>{submission.assignment_title}</td>
                  <td>
                    <a href={submission.github_url} target="_blank" rel="noopener noreferrer" className="github-link">
                      View Repository →
                    </a>
                  </td>
                  <td>{new Date(submission.submitted_at).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge status-${submission.status}`}>{submission.status}</span>
                  </td>
                  <td>
                    <Button variant="primary" size="small" onClick={() => handleGiveFeedback(submission)}>
                      Give Feedback
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showFeedbackForm && (
        <FeedbackForm
          submission={selectedSubmission}
          onClose={() => {
            setShowFeedbackForm(false)
            setSelectedSubmission(null)
          }}
          onSuccess={() => {
            setShowFeedbackForm(false)
            setSelectedSubmission(null)
            fetchSubmissions()
          }}
        />
      )}
    </div>
  )
}

export default SubmissionReview
