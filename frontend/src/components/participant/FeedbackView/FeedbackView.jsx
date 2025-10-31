"use client"

import { useState, useEffect } from "react"
import { feedbackAPI } from "../../../services/api"
import "./FeedbackView.css"

const FeedbackView = ({ submissionId, onClose }) => {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeedback()
  }, [submissionId])

  const fetchFeedback = async () => {
    try {
      setLoading(true)
      const response = await feedbackAPI.getBySubmissionId(submissionId)
      setFeedback(response.data)
    } catch (error) {
      console.error("Failed to fetch feedback:", error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Feedback</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="feedback-view">
          {loading ? (
            <div className="feedback-loading">Loading feedback...</div>
          ) : feedback.length === 0 ? (
            <div className="feedback-empty">
              <p>No feedback yet. Your submission is being reviewed.</p>
            </div>
          ) : (
            <div className="feedback-list">
              {feedback.map((item) => (
                <div key={item.id} className="feedback-item">
                  <div className="feedback-header">
                    <div className="feedback-reviewer">
                      <img
                        src={item.reviewer_avatar || "/placeholder.svg?height=40&width=40"}
                        alt={item.reviewer_name}
                        className="feedback-avatar"
                      />
                      <div>
                        <div className="feedback-reviewer-name">{item.reviewer_name}</div>
                        <div className="feedback-date">{new Date(item.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>

                    {item.rating && (
                      <div className="feedback-rating">
                        <span className="rating-stars">{renderStars(item.rating)}</span>
                        <span className="rating-value">{item.rating}/5</span>
                      </div>
                    )}
                  </div>

                  {item.category && <div className="feedback-category">{item.category}</div>}

                  <div className="feedback-content">{item.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FeedbackView
