"use client"

import { useState, useEffect } from "react"
import { coursesAPI } from "../../../services/api"
import Button from "../../common/Button/Button"
import InfoTooltip from "../../common/InfoTooltip/InfoTooltip"
import "./CourseManager.css"

const CourseManager = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    repo_url: "",
    is_public: false,
  })

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await coursesAPI.getAll()
      setCourses(response.data)
    } catch (error) {
      console.error("Failed to fetch courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCourse) {
        await coursesAPI.update(editingCourse.id, formData)
      } else {
        await coursesAPI.create(formData)
      }
      setShowForm(false)
      setEditingCourse(null)
      setFormData({ title: "", description: "", repo_url: "", is_public: false })
      fetchCourses()
    } catch (error) {
      console.error("Failed to save course:", error)
      alert("Failed to save course")
    }
  }

  const handleEdit = (course) => {
    setEditingCourse(course)
    setFormData({
      title: course.title,
      description: course.description,
      repo_url: course.repo_url,
      is_public: course.is_public,
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this course? This will also delete all associated assignments.")) {
      return
    }
    try {
      await coursesAPI.delete(id)
      fetchCourses()
    } catch (error) {
      console.error("Failed to delete course:", error)
      alert("Failed to delete course")
    }
  }

  if (loading) {
    return <div>Loading courses...</div>
  }

  return (
    <div className="course-manager">
      <div className="manager-header">
        <h2>Course Management</h2>
        <Button
          variant="primary"
          onClick={() => {
            setShowForm(true)
            setEditingCourse(null)
            setFormData({ title: "", description: "", repo_url: "", is_public: false })
          }}
        >
          Add New Course
        </Button>
      </div>

      {showForm && (
        <div className="manager-form">
          <h3>{editingCourse ? "Edit Course" : "Create New Course"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Course Title
                <InfoTooltip text="Enter the full name of the course" />
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
                <InfoTooltip text="Provide a brief description of what students will learn" />
              </label>
              <textarea
                className="form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="form-group">
              <label>
                Repository URL
                <InfoTooltip text="GitHub repository URL containing course materials" />
              </label>
              <input
                type="url"
                className="form-input"
                value={formData.repo_url}
                onChange={(e) => setFormData({ ...formData, repo_url: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.is_public}
                  onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                />
                <span>Make this course public (visible on roadmap)</span>
                <InfoTooltip text="Public courses are visible to everyone on the public roadmap" />
              </label>
            </div>

            <div className="form-actions">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowForm(false)
                  setEditingCourse(null)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingCourse ? "Update Course" : "Create Course"}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="course-list">
        {courses.length === 0 ? (
          <div className="empty-state">No courses yet. Create your first course to get started.</div>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="course-item">
              <div className="course-item-header">
                <h3>{course.title}</h3>
                {course.is_public && <span className="public-badge">Public</span>}
              </div>
              <p className="course-description">{course.description}</p>
              <a href={course.repo_url} target="_blank" rel="noopener noreferrer" className="course-repo-link">
                View Repository →
              </a>
              <div className="course-item-actions">
                <Button variant="outline" size="small" onClick={() => handleEdit(course)}>
                  Edit
                </Button>
                <Button variant="ghost" size="small" onClick={() => handleDelete(course.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CourseManager
