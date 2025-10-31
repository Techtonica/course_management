"use client"

import { useState } from "react"
import { assignmentsAPI } from "../../services/api"
import Button from "../common/Button/Button"
import InfoTooltip from "../common/InfoTooltip/InfoTooltip"

const BulkAssignForm = ({ assignments, onClose }) => {
  const [selectedAssignment, setSelectedAssignment] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [count, setCount] = useState(0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedAssignment) return

    try {
      setLoading(true)
      const response = await assignmentsAPI.bulkAssign(selectedAssignment)
      setCount(response.data.count)
      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      console.error("Failed to bulk assign:", error)
      alert("Failed to bulk assign assignment")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Bulk Assign to All Participants</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "var(--spacing-lg)" }}>
          <div className="form-group">
            <label>
              Select Assignment
              <InfoTooltip text="This assignment will be assigned to all participants in the system" />
            </label>
            <select
              className="form-select"
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
              required
              disabled={loading || success}
            >
              <option value="">Choose an assignment</option>
              {assignments.map((assignment) => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.course_title} - {assignment.title}
                </option>
              ))}
            </select>
          </div>

          {success && (
            <div
              style={{
                padding: "var(--spacing-md)",
                backgroundColor: "#d1fae5",
                borderRadius: "var(--radius-md)",
                marginBottom: "var(--spacing-md)",
              }}
            >
              Successfully assigned to {count} participants!
            </div>
          )}

          <div className="form-actions">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading || success}>
              {loading ? "Assigning..." : "Assign to All Participants"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BulkAssignForm
