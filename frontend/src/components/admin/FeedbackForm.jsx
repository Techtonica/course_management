"use client"

import { useState } from "react"
import { feedbackAPI } from "../../services/api"
import Button from "../common/Button/Button"
import InfoTooltip from "../common/InfoTooltip/InfoTooltip"

const FeedbackForm = ({ submission, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    category: "",
    content: "",
  })
  const [loading, setLoading] = useState(false)

  const categories = ["Code Quality", "Completeness", "Documentation", "Best Practices", "Creativity", "General"]

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await feedbackAPI.create({
        submission_id: submission.id,
        ...formData,
      })
      onSuccess()
    } catch (error) {
      console.error("Failed to submit feedback:", error)
      alert("Failed to submit feedback")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Give Feedback</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div
          style={{
            padding: "var(--spacing-lg)",
            backgroundColor: "var(--color-gray-100)",
            borderBottom: "2px solid var(--color-gray-200)",
          }}
        >
          <p>
            <strong>Student:</strong> {submission.user_name} (@{submission.github_username})
          </p>
          <p>
            <strong>Assignment:</strong> {submission.assignment_title}
          </p>
          <p>
            <strong>Repository:</strong>{" "}
            <a href={submission.github_url} target="_blank" rel="noopener noreferrer">
              {submission.github_url}
            </a>
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "var(--spacing-lg)" }}>
          <div className="form-group">
            <label>
              Rating (1-5)
              <InfoTooltip text="Rate the overall quality of the submission" />
            </label>
            <div style={{ display: "flex", gap: "var(--spacing-sm)", alignItems: "center" }}>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number.parseInt(e.target.value) })}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--color-accent)" }}>
                {"★".repeat(formData.rating)}
                {"☆".repeat(5 - formData.rating)}
              </span>
              <span style={{ fontWeight: "700" }}>{formData.rating}/5</span>
            </div>
          </div>

          <div className="form-group">
            <label>
              Category
              <InfoTooltip text="Select the main focus area of your feedback" />
            </label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              Feedback
              <InfoTooltip text="Provide detailed, constructive feedback to help the student improve" />
            </label>
            <textarea
              className="form-textarea"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              placeholder="Write your feedback here..."
              required
            />
          </div>

          <div className="form-actions">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FeedbackForm
