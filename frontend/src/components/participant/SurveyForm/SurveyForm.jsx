"use client"

import { useState, useEffect } from "react"
import { surveysAPI } from "../../../services/api"
import Button from "../../common/Button/Button"
import InfoTooltip from "../../common/InfoTooltip/InfoTooltip"
import "./SurveyForm.css"

const SurveyForm = ({ assignmentId, onClose, onSuccess }) => {
  const [template, setTemplate] = useState(null)
  const [responses, setResponses] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchSurveyTemplate()
  }, [assignmentId])

  const fetchSurveyTemplate = async () => {
    try {
      setLoading(true)
      const response = await surveysAPI.getTemplate(assignmentId)
      setTemplate(response.data)

      // Initialize responses
      const initialResponses = {}
      response.data.questions.forEach((q) => {
        if (q.type === "checkbox") {
          initialResponses[q.id] = []
        } else {
          initialResponses[q.id] = ""
        }
      })
      setResponses(initialResponses)
    } catch (error) {
      console.error("Failed to fetch survey template:", error)
      setError("No survey available for this assignment")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (questionId, value, type) => {
    if (type === "checkbox") {
      const currentValues = responses[questionId] || []
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value]
      setResponses({ ...responses, [questionId]: newValues })
    } else {
      setResponses({ ...responses, [questionId]: value })
    }
  }

  const validateForm = () => {
    const requiredQuestions = template.questions.filter((q) => q.required)
    for (const question of requiredQuestions) {
      const response = responses[question.id]
      if (!response || (Array.isArray(response) && response.length === 0)) {
        return `Please answer: ${question.label}`
      }
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setSubmitting(true)
      await surveysAPI.submitResponse({
        survey_template_id: template.id,
        responses,
      })
      onSuccess()
    } catch (err) {
      console.error("Survey submission error:", err)
      setError(err.response?.data?.error || "Failed to submit survey")
    } finally {
      setSubmitting(false)
    }
  }

  const renderQuestion = (question) => {
    switch (question.type) {
      case "dropdown":
        return (
          <select
            className="form-select"
            value={responses[question.id] || ""}
            onChange={(e) => handleInputChange(question.id, e.target.value, "dropdown")}
            required={question.required}
          >
            <option value="">Select an option</option>
            {question.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case "radio":
        return (
          <div className="radio-group">
            {question.options.map((option) => (
              <label key={option} className="radio-label">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={responses[question.id] === option}
                  onChange={(e) => handleInputChange(question.id, e.target.value, "radio")}
                  required={question.required}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )

      case "checkbox":
        return (
          <div className="checkbox-group">
            {question.options.map((option) => (
              <label key={option} className="checkbox-label">
                <input
                  type="checkbox"
                  value={option}
                  checked={(responses[question.id] || []).includes(option)}
                  onChange={(e) => handleInputChange(question.id, option, "checkbox")}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )

      case "text":
        return (
          <textarea
            className="form-textarea"
            value={responses[question.id] || ""}
            onChange={(e) => handleInputChange(question.id, e.target.value, "text")}
            placeholder="Enter your response..."
            required={question.required}
          />
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Loading Survey...</h2>
            <button className="modal-close" onClick={onClose}>
              ×
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Survey</h2>
            <button className="modal-close" onClick={onClose}>
              ×
            </button>
          </div>
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <p>No survey available for this assignment.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content survey-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Assignment Survey</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="survey-form">
          {template.questions.map((question) => (
            <div key={question.id} className="form-group">
              <label>
                {question.label}
                {question.required && <span className="required-indicator">*</span>}
                {question.info && <InfoTooltip text={question.info} />}
              </label>
              {renderQuestion(question)}
            </div>
          ))}

          {error && <div className="form-error">{error}</div>}

          <div className="form-actions">
            <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Survey"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SurveyForm
