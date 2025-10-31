"use client"

import { useState } from "react"
import ProgressIndicator from "../../common/ProgressIndicator/ProgressIndicator"
import Button from "../../common/Button/Button"
import SubmissionForm from "../SubmissionForm/SubmissionForm"
import FeedbackView from "../FeedbackView/FeedbackView"
import SurveyForm from "../SurveyForm/SurveyForm"
import "./AssignmentCard.css"

const AssignmentCard = ({ assignment, onUpdate }) => {
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showSurvey, setShowSurvey] = useState(false)

  const isDueSoon = () => {
    if (!assignment.due_date) return false
    const dueDate = new Date(assignment.due_date)
    const now = new Date()
    const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24))
    return daysUntilDue <= 3 && daysUntilDue >= 0
  }

  const isOverdue = () => {
    if (!assignment.due_date) return false
    const dueDate = new Date(assignment.due_date)
    const now = new Date()
    return dueDate < now && assignment.status !== "completed"
  }

  return (
    <div className={`assignment-card ${isOverdue() ? "overdue" : ""} ${isDueSoon() ? "due-soon" : ""}`}>
      <div className="assignment-card-header">
        <div className="assignment-card-title-section">
          <ProgressIndicator status={assignment.status} />
          <div>
            <h3 className="assignment-card-title">{assignment.assignment_title}</h3>
            <p className="assignment-card-course">{assignment.course_title}</p>
          </div>
        </div>

        {assignment.due_date && (
          <div className="assignment-card-due-date">
            <span className="due-date-label">Due:</span>
            <span
              className={`due-date-value ${isOverdue() ? "overdue-text" : ""} ${isDueSoon() ? "due-soon-text" : ""}`}
            >
              {new Date(assignment.due_date).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {assignment.description && <p className="assignment-card-description">{assignment.description}</p>}

      <div className="assignment-card-actions">
        <Button variant="ghost" size="small" onClick={() => window.open(assignment.github_instruction_url, "_blank")}>
          View Instructions
        </Button>

        {assignment.submission_id ? (
          <>
            <Button variant="outline" size="small" onClick={() => setShowSubmissionForm(true)}>
              Update Submission
            </Button>
            <Button variant="primary" size="small" onClick={() => setShowFeedback(true)}>
              View Feedback
            </Button>
            {assignment.submission_status === "reviewed" && (
              <Button variant="accent" size="small" onClick={() => setShowSurvey(true)}>
                Complete Survey
              </Button>
            )}
          </>
        ) : (
          <Button variant="primary" size="small" onClick={() => setShowSubmissionForm(true)}>
            Submit Assignment
          </Button>
        )}
      </div>

      {assignment.github_url && (
        <div className="assignment-card-submission-info">
          <span className="submission-label">Submitted:</span>
          <a href={assignment.github_url} target="_blank" rel="noopener noreferrer" className="submission-link">
            {assignment.github_url}
          </a>
          <span className={`submission-status status-${assignment.submission_status}`}>
            {assignment.submission_status}
          </span>
        </div>
      )}

      {showSubmissionForm && (
        <SubmissionForm
          assignment={assignment}
          onClose={() => setShowSubmissionForm(false)}
          onSuccess={() => {
            setShowSubmissionForm(false)
            onUpdate()
          }}
        />
      )}

      {showFeedback && <FeedbackView submissionId={assignment.submission_id} onClose={() => setShowFeedback(false)} />}

      {showSurvey && (
        <SurveyForm
          assignmentId={assignment.assignment_id}
          onClose={() => setShowSurvey(false)}
          onSuccess={() => {
            setShowSurvey(false)
            onUpdate()
          }}
        />
      )}
    </div>
  )
}

export default AssignmentCard
