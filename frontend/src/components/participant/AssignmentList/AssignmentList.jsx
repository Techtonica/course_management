"use client"

import { useState } from "react"
import AssignmentCard from "../AssignmentCard/AssignmentCard"
import "./AssignmentList.css"

const AssignmentList = ({ progress, onUpdate }) => {
  const [filter, setFilter] = useState("all")

  const filteredProgress = progress.filter((item) => {
    if (filter === "all") return true
    if (filter === "completed") return item.status === "completed"
    if (filter === "in_progress") return item.status === "in_progress"
    if (filter === "not_started") return item.status === "not_started"
    if (filter === "pending_review") return item.submission_status === "pending"
    return true
  })

  return (
    <div className="assignment-list">
      <div className="assignment-list-header">
        <h2>My Assignments</h2>

        <div className="assignment-filters">
          <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
            All
          </button>
          <button
            className={`filter-btn ${filter === "not_started" ? "active" : ""}`}
            onClick={() => setFilter("not_started")}
          >
            Not Started
          </button>
          <button
            className={`filter-btn ${filter === "in_progress" ? "active" : ""}`}
            onClick={() => setFilter("in_progress")}
          >
            In Progress
          </button>
          <button
            className={`filter-btn ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
          <button
            className={`filter-btn ${filter === "pending_review" ? "active" : ""}`}
            onClick={() => setFilter("pending_review")}
          >
            Pending Review
          </button>
        </div>
      </div>

      <div className="assignment-cards">
        {filteredProgress.length === 0 ? (
          <div className="no-assignments">No assignments found for this filter.</div>
        ) : (
          filteredProgress.map((item) => (
            <AssignmentCard key={item.assignment_id} assignment={item} onUpdate={onUpdate} />
          ))
        )}
      </div>
    </div>
  )
}

export default AssignmentList
