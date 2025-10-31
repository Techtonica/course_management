"use client"

import { useState } from "react"
import { submissionsAPI } from "../../../services/api"
import Button from "../../common/Button/Button"
import InfoTooltip from "../../common/InfoTooltip/InfoTooltip"
import "./SubmissionForm.css"

const SubmissionForm = ({ assignment, onClose, onSuccess }) => {
  const [githubUrl, setGithubUrl] = useState(assignment.github_url || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const validateGithubUrl = (url) => {
    const githubPattern = /^https?:\/\/(www\.)?github\.com\/.+/
    return githubPattern.test(url)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!githubUrl.trim()) {
      setError("GitHub URL is required")
      return
    }

    if (!validateGithubUrl(githubUrl)) {
      setError("Please enter a valid GitHub URL")
      return
    }

    try {
      setLoading(true)
      await submissionsAPI.createOrUpdate({
        assignment_id: assignment.assignment_id,
        github_url: githubUrl,
      })
      onSuccess()
    } catch (err) {
      console.error("Submission error:", err)
      setError(err.response?.data?.error || "Failed to submit assignment")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Submit Assignment</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="submission-form">
          <div className="form-group">
            <label htmlFor="github-url">
              GitHub Repository URL
              <InfoTooltip text="Enter the full URL to your GitHub repository containing your completed assignment" />
            </label>
            <input
              id="github-url"
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              className="form-input"
              disabled={loading}
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="form-actions">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Submitting..." : assignment.github_url ? "Update Submission" : "Submit Assignment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SubmissionForm
