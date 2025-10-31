"use client"

import { useState, useEffect } from "react"
import api from "../../services/api"
import InfoTooltip from "../../components/common/InfoTooltip/InfoTooltip"
import "./PublicRoadmap.css"

const PublicRoadmap = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)

  useEffect(() => {
    fetchPublicCourses()
  }, [])

  const fetchPublicCourses = async () => {
    try {
      setLoading(true)
      const response = await api.get("/courses?public=true")

      // Fetch assignments for each course
      const coursesWithAssignments = await Promise.all(
        response.data.map(async (course) => {
          try {
            const assignmentsResponse = await api.get(`/assignments?courseId=${course.id}`)
            return {
              ...course,
              assignments: assignmentsResponse.data.sort((a, b) => a.order - b.order),
            }
          } catch (err) {
            return {
              ...course,
              assignments: [],
            }
          }
        }),
      )

      setCourses(coursesWithAssignments)
      if (coursesWithAssignments.length > 0) {
        setSelectedCourse(coursesWithAssignments[0])
      }
      setError(null)
    } catch (err) {
      setError("Failed to load course roadmap")
      console.error("Error fetching courses:", err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const isUpcoming = (dueDate) => {
    return new Date(dueDate) > new Date()
  }

  const isPast = (dueDate) => {
    return new Date(dueDate) < new Date()
  }

  if (loading) {
    return (
      <div className="roadmap-page">
        <div className="loading">Loading course roadmap...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="roadmap-page">
        <div className="error">{error}</div>
      </div>
    )
  }

  return (
    <div className="roadmap-page">
      <header className="roadmap-header">
        <div className="header-content">
          <h1>Software Engineering Program Roadmap</h1>
          <p>Explore our curriculum and upcoming assignments</p>
        </div>
      </header>

      <div className="roadmap-container">
        {courses.length === 0 ? (
          <div className="no-courses">No public courses available at this time.</div>
        ) : (
          <>
            <div className="course-selector">
              <h2>
                Select Course
                <InfoTooltip text="Choose a course to view its curriculum and assignment schedule" />
              </h2>
              <div className="course-tabs">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    className={`course-tab ${selectedCourse?.id === course.id ? "active" : ""}`}
                    onClick={() => setSelectedCourse(course)}
                  >
                    {course.title}
                  </button>
                ))}
              </div>
            </div>

            {selectedCourse && (
              <div className="course-details">
                <div className="course-header">
                  <h2>{selectedCourse.title}</h2>
                  <p className="course-description">{selectedCourse.description}</p>
                  {selectedCourse.repo_url && (
                    <a href={selectedCourse.repo_url} target="_blank" rel="noopener noreferrer" className="repo-link">
                      View Course Repository on GitHub →
                    </a>
                  )}
                </div>

                <div className="assignments-timeline">
                  <h3>
                    Assignment Schedule
                    <InfoTooltip text="Timeline of all assignments in this course with due dates" />
                  </h3>

                  {selectedCourse.assignments.length === 0 ? (
                    <div className="no-assignments">No assignments scheduled yet.</div>
                  ) : (
                    <div className="timeline">
                      {selectedCourse.assignments.map((assignment, index) => (
                        <div
                          key={assignment.id}
                          className={`timeline-item ${isPast(assignment.due_date) ? "past" : ""} ${
                            isUpcoming(assignment.due_date) ? "upcoming" : ""
                          }`}
                        >
                          <div className="timeline-marker">
                            <span className="assignment-number">{index + 1}</span>
                          </div>
                          <div className="timeline-content">
                            <div className="assignment-header">
                              <h4>{assignment.title}</h4>
                              <span className={`due-date ${isPast(assignment.due_date) ? "past" : "upcoming"}`}>
                                {isPast(assignment.due_date) ? "Completed: " : "Due: "}
                                {formatDate(assignment.due_date)}
                              </span>
                            </div>
                            <p className="assignment-description">{assignment.description}</p>
                            {assignment.github_instruction_url && (
                              <a
                                href={assignment.github_instruction_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="instruction-link"
                              >
                                View Instructions →
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <footer className="roadmap-footer">
        <p>Want to join the program? Contact us to learn more about enrollment.</p>
      </footer>
    </div>
  )
}

export default PublicRoadmap
