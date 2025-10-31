"use client"

import { useState, useEffect } from "react"
import { assignmentsAPI, surveysAPI, exportAPI } from "../../../services/api"
import Button from "../../common/Button/Button"
import InfoTooltip from "../../common/InfoTooltip/InfoTooltip"
import "./SurveyBuilder.css"

const SurveyBuilder = () => {
  const [assignments, setAssignments] = useState([])
  const [selectedAssignment, setSelectedAssignment] = useState("")
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [viewingResponses, setViewingResponses] = useState(false)
  const [responses, setResponses] = useState([])

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      const response = await assignmentsAPI.getAll()
      setAssignments(response.data)
    } catch (error) {
      console.error("Failed to fetch assignments:", error)
    }
  }

  const loadSurveyTemplate = async (assignmentId) => {
    try {
      const response = await surveysAPI.getTemplate(assignmentId)
      setQuestions(response.data.questions)
    } catch (error) {
      // No template exists yet
      setQuestions([])
    }
  }

  const handleAssignmentChange = (assignmentId) => {
    setSelectedAssignment(assignmentId)
    if (assignmentId) {
      loadSurveyTemplate(assignmentId)
    } else {
      setQuestions([])
    }
  }

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `q_${Date.now()}`,
        type: "text",
        label: "",
        options: [],
        required: false,
        info: "",
      },
    ])
  }

  const updateQuestion = (index, field, value) => {
    const updated = [...questions]
    updated[index][field] = value
    setQuestions(updated)
  }

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!selectedAssignment) {
      alert("Please select an assignment")
      return
    }

    try {
      setLoading(true)
      await surveysAPI.createTemplate({
        assignment_id: selectedAssignment,
        questions,
      })
      alert("Survey template saved successfully!")
    } catch (error) {
      console.error("Failed to save survey:", error)
      alert("Failed to save survey template")
    } finally {
      setLoading(false)
    }
  }

  const handleViewResponses = async () => {
    if (!selectedAssignment) {
      alert("Please select an assignment")
      return
    }

    try {
      setLoading(true)
      const response = await surveysAPI.getResponses(selectedAssignment)
      setResponses(response.data)
      setViewingResponses(true)
    } catch (error) {
      console.error("Failed to fetch responses:", error)
      alert("Failed to fetch survey responses")
    } finally {
      setLoading(false)
    }
  }

  const handleExportResponses = async () => {
    if (!selectedAssignment) return

    try {
      const response = await exportAPI.surveys(selectedAssignment)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `survey_responses_${new Date().toISOString().split("T")[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error("Failed to export responses:", error)
      alert("Failed to export survey responses")
    }
  }

  if (viewingResponses) {
    return (
      <div className="survey-builder">
        <div className="manager-header">
          <h2>Survey Responses</h2>
          <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
            <Button variant="accent" onClick={handleExportResponses}>
              Export to CSV
            </Button>
            <Button variant="outline" onClick={() => setViewingResponses(false)}>
              Back to Builder
            </Button>
          </div>
        </div>

        {responses.length === 0 ? (
          <div className="empty-state">No responses yet for this survey.</div>
        ) : (
          <div className="responses-list">
            {responses.map((response) => (
              <div key={response.id} className="response-item">
                <div className="response-header">
                  <strong>{response.user_name}</strong>
                  <span className="response-date">{new Date(response.created_at).toLocaleDateString()}</span>
                </div>
                <div className="response-content">
                  {Object.entries(response.responses).map(([key, value]) => (
                    <div key={key} className="response-field">
                      <strong>{key}:</strong> {Array.isArray(value) ? value.join(", ") : value}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="survey-builder">
      <div className="manager-header">
        <h2>Survey Builder</h2>
        <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
          <Button variant="outline" onClick={handleViewResponses} disabled={!selectedAssignment}>
            View Responses
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={loading || !selectedAssignment}>
            {loading ? "Saving..." : "Save Survey"}
          </Button>
        </div>
      </div>

      <div className="form-group">
        <label>
          Select Assignment
          <InfoTooltip text="Choose which assignment this survey is for" />
        </label>
        <select
          className="form-select"
          value={selectedAssignment}
          onChange={(e) => handleAssignmentChange(e.target.value)}
        >
          <option value="">Select an assignment</option>
          {assignments.map((assignment) => (
            <option key={assignment.id} value={assignment.id}>
              {assignment.course_title} - {assignment.title}
            </option>
          ))}
        </select>
      </div>

      {selectedAssignment && (
        <>
          <div className="questions-list">
            {questions.map((question, index) => (
              <div key={question.id} className="question-builder">
                <div className="question-header">
                  <h4>Question {index + 1}</h4>
                  <Button variant="ghost" size="small" onClick={() => removeQuestion(index)}>
                    Remove
                  </Button>
                </div>

                <div className="form-group">
                  <label>Question Type</label>
                  <select
                    className="form-select"
                    value={question.type}
                    onChange={(e) => updateQuestion(index, "type", e.target.value)}
                  >
                    <option value="text">Text</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="radio">Radio</option>
                    <option value="checkbox">Checkbox</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Question Label</label>
                  <input
                    type="text"
                    className="form-input"
                    value={question.label}
                    onChange={(e) => updateQuestion(index, "label", e.target.value)}
                    placeholder="Enter your question"
                  />
                </div>

                {(question.type === "dropdown" || question.type === "radio" || question.type === "checkbox") && (
                  <div className="form-group">
                    <label>Options (comma-separated)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={question.options.join(", ")}
                      onChange={(e) =>
                        updateQuestion(
                          index,
                          "options",
                          e.target.value.split(",").map((o) => o.trim()),
                        )
                      }
                      placeholder="Option 1, Option 2, Option 3"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Info Tooltip Text</label>
                  <input
                    type="text"
                    className="form-input"
                    value={question.info}
                    onChange={(e) => updateQuestion(index, "info", e.target.value)}
                    placeholder="Helpful information for this question"
                  />
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={question.required}
                      onChange={(e) => updateQuestion(index, "required", e.target.checked)}
                    />
                    <span>Required question</span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <Button variant="accent" onClick={addQuestion}>
            Add Question
          </Button>
        </>
      )}
    </div>
  )
}

export default SurveyBuilder
