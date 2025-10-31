"use client"

import ProgressIndicator from "../../common/ProgressIndicator/ProgressIndicator"
import "./ProgressTracker.css"

const ProgressTracker = ({ progress }) => {
  // Group progress by course
  const progressByCourse = progress.reduce((acc, item) => {
    const courseTitle = item.course_title
    if (!acc[courseTitle]) {
      acc[courseTitle] = []
    }
    acc[courseTitle].push(item)
    return acc
  }, {})

  return (
    <div className="progress-tracker">
      <h2>Progress Overview</h2>

      {Object.entries(progressByCourse).map(([courseTitle, items]) => {
        const completed = items.filter((i) => i.status === "completed").length
        const total = items.length
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

        return (
          <div key={courseTitle} className="course-progress">
            <div className="course-progress-header">
              <h3>{courseTitle}</h3>
              <span className="course-progress-percentage">{percentage}% Complete</span>
            </div>

            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
            </div>

            <div className="assignment-progress-list">
              {items
                .sort((a, b) => a.order_num - b.order_num)
                .map((item) => (
                  <div key={item.assignment_id} className="assignment-progress-item">
                    <ProgressIndicator status={item.status} />
                    <span className="assignment-progress-title">{item.assignment_title}</span>
                    {item.status === "completed" && item.completed_at && (
                      <span className="assignment-progress-date">
                        Completed {new Date(item.completed_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ProgressTracker
