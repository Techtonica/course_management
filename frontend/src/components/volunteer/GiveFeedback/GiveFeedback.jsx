"use client"

import { useState } from "react"
import api from "../../../services/api"
import InfoTooltip from "../../common/InfoTooltip/InfoTooltip"
import "./GiveFeedback.css"

const GiveFeedback = ({ submission, onCancel, onSubmitted }) => {
  const [formData, setFormData] = useState({
    rating: "",
    category: "",
    content: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const categories = [
    "code_quality",
    "completeness",
    "documentation",
    "best_practices",
    "creativity",
    "problem_solving",
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.content.trim()) {
      setError("Please provide feedback content")
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      await api.post("/feedback", {
        submission_id: submission.id,
        rating: formData.rating ? Number.parseInt(formData.rating) : null,
        category: formData.category || null,
        content: formData.content,
      })

      onSubmitted()
    } catch (err) {
      setError("Failed to submit feedback. Please try again.")
      console.error("Error submitting feedback:", err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="give-feedback">
      <div className="feedback-header">
        <h2>Give Feedback</h2>
        <button className="close-button" onClick={onCancel}>
          ✕
        </button>
      </div>

      <div className="submission-info">
        <h3>{submission.assignment_title}</h3>
        <a href={submission.github_url} target="_blank" rel="noopener noreferrer" className="github-link">
          View Submission on GitHub →
        </a>
      </div>

      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label htmlFor="rating">
            Rating (Optional)
            <InfoTooltip text="Rate the submission from 1 to 5 stars based on overall quality" />
          </label>
          <select id="rating" name="rating" value={formData.rating} onChange={handleChange} className="form-select">
            <option value="">Select rating...</option>
            <option value="1">1 - Needs significant improvement</option>
            <option value="2">2 - Below expectations</option>
            <option value="3">3 - Meets expectations</option>
            <option value="4">4 - Exceeds expectations</option>
            <option value="5">5 - Outstanding</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="category">
            Category (Optional)
            <InfoTooltip text="Select the primary focus area of your feedback" />
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select category...</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="content">
            Feedback *
            <InfoTooltip text="Provide detailed, constructive feedback to help the participant improve" />
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your feedback here..."
            rows="8"
            className="form-textarea"
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-button" disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default GiveFeedback
