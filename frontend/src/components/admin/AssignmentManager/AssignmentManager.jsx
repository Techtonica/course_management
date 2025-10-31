"use client"

import { useState, useEffect } from "react"
import { coursesAPI, assignmentsAPI } from "../../../services/api"
import Button from "../../common/Button/Button"
import InfoTooltip from "../../common/InfoTooltip/InfoTooltip"
import BulkAssignForm from "../BulkAssignForm"
import "./AssignmentManager.css"

const AssignmentManager = () => {
  const [courses, setCourses] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showBulkAssign, setShowBulkAssign] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState(null)
  const [formData, setFormData] = useState({
    course_id: "",
    title: "",
    description: "",
    due_date: "",
    github_instruction_url: "",
    order_num: 1,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [coursesRes, assignmentsRes] = await Promise.all([coursesAPI.getAll(), assignmentsAPI.getAll()])
      setCourses(coursesRes.data)
      setAssignments(assignmentsRes.data)
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingAssignment) {
        await assignmentsAPI.update(editingAssignment.id, formData)
      } else {
        await assignmentsAPI.create(formData)
      }
      setShowForm(false)
      setEditingAssignment(null)
      setFormData({
        course_id: "",
        title: "",
        description: "",
        due_date: "",
        github_instruction_url: "",
        order_num: 1,
      })
      fetchData()
    } catch (error) {
      console.error("Failed to save assignment:", error)
      alert("Failed to save assignment")
    }
  }

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment)
    setFormData({
      course_id: assignment.course_id,
      title: assignment.title,
      description: assignment.description,
      due_date: assignment.due_date ? assignment.due_date.split("T")[0] : "",
      github_instruction_url: assignment.github_instruction_url,
      order_num: assignment.order_num,
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this assignment?")) {
      return
    }
    try {
      await assignmentsAPI.delete(id)
      fetchData()
    } catch (error) {
      console.error("Failed to delete assignment:", error)
      alert("Failed to delete assignment")
    }
  }

  if (loading) {
    return <div>Loading assignments...</div>
  }

  return (
    <div className="assignment-manager">
      <div className="manager-header">
        <h2>Assignment Management</h2>
        <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
          <Button variant="accent" onClick={() => setShowBulkAssign(true)}>
            Bulk Assign
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowForm(true)
              setEditingAssignment(null)
              setFormData({
                course_id: "",
                title: "",
                description: "",
                due_date: "",
                github_instruction_url: "",
                order_num: 1,
              })
            }}
          >
            Add New Assignment
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="manager-form">
          <h3>{editingAssignment ? "Edit Assignment" : "Create New Assignment"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Course
                <InfoTooltip text="Select the course this assignment belongs to" />
              </label>
              <select
                className="form-select"
                value={formData.course_id}
                onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                required
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                Assignment Title
                <InfoTooltip text="Enter a clear, descriptive title for the assignment" />
              </label>
              <input
                type="text"
                className="form-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Description
                <InfoTooltip text="Provide details about what students need to do" />
              </label>
              <textarea
                className="form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Due Date
                  <InfoTooltip text="When should students complete this assignment?" />
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>
                  Order
                  <InfoTooltip text="Sequence number for displaying assignments in order" />
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.order_num}
                  onChange={(e) => setFormData({ ...formData, order_num: Number.parseInt(e.target.value) })}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                GitHub Instructions URL
                <InfoTooltip text="Link to the assignment instructions in your GitHub repository" />
              </label>
              <input
                type="url"
                className="form-input"
                value={formData.github_instruction_url}
                onChange={(e) => setFormData({ ...formData, github_instruction_url: e.target.value })}
                required
              />
            </div>

            <div className="form-actions">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowForm(false)
                  setEditingAssignment(null)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingAssignment ? "Update Assignment" : "Create Assignment"}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="assignment-list">
        {assignments.length === 0 ? (
          <div className="empty-state">No assignments yet. Create your first assignment to get started.</div>
        ) : (
          assignments.map((assignment) => (
            <div key={assignment.id} className="assignment-item">
              <div className="assignment-item-header">
                <div>
                  <h3>{assignment.title}</h3>
                  <p className="assignment-course">{assignment.course_title}</p>
                </div>
                <span className="assignment-order">#{assignment.order_num}</span>
              </div>
              <p className="assignment-description">{assignment.description}</p>
              {assignment.due_date && (
                <p className="assignment-due-date">Due: {new Date(assignment.due_date).toLocaleDateString()}</p>
              )}
              <a
                href={assignment.github_instruction_url}
                target="_blank"
                rel="noopener noreferrer"
                className="assignment-link"
              >
                View Instructions →
              </a>
              <div className="assignment-item-actions">
                <Button variant="outline" size="small" onClick={() => handleEdit(assignment)}>
                  Edit
                </Button>
                <Button variant="ghost" size="small" onClick={() => handleDelete(assignment.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {showBulkAssign && <BulkAssignForm assignments={assignments} onClose={() => setShowBulkAssign(false)} />}
    </div>
  )
}

export default AssignmentManager
