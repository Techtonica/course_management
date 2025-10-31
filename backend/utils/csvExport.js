const { Parser } = require("json2csv")

// Export submissions to CSV
exports.exportSubmissionsToCSV = (submissions) => {
  const fields = [
    { label: "Submission ID", value: "id" },
    { label: "Student Name", value: "user_name" },
    { label: "GitHub Username", value: "github_username" },
    { label: "Email", value: "email" },
    { label: "Course", value: "course_title" },
    { label: "Assignment", value: "assignment_title" },
    { label: "GitHub URL", value: "github_url" },
    { label: "Status", value: "status" },
    { label: "Submitted At", value: "submitted_at" },
  ]

  const parser = new Parser({ fields })
  const csv = parser.parse(submissions)
  return csv
}

// Export progress to CSV
exports.exportProgressToCSV = (progressData) => {
  const fields = [
    { label: "Student Name", value: "user_name" },
    { label: "GitHub Username", value: "github_username" },
    { label: "Email", value: "email" },
    { label: "Course", value: "course_title" },
    { label: "Assignment", value: "assignment_title" },
    { label: "Status", value: "status" },
    { label: "Submission URL", value: "github_url" },
    { label: "Submission Status", value: "submission_status" },
    { label: "Completed At", value: "completed_at" },
  ]

  const parser = new Parser({ fields })
  const csv = parser.parse(progressData)
  return csv
}

// Export survey responses to CSV
exports.exportSurveyResponsesToCSV = (responses) => {
  // Flatten JSON responses for CSV
  const flattenedData = responses.map((response) => {
    const flat = {
      user_name: response.user_name,
      github_username: response.github_username,
      created_at: response.created_at,
    }

    // Add each response field
    const responsesObj = typeof response.responses === "string" ? JSON.parse(response.responses) : response.responses
    Object.keys(responsesObj).forEach((key) => {
      flat[key] = Array.isArray(responsesObj[key]) ? responsesObj[key].join(", ") : responsesObj[key]
    })

    return flat
  })

  const parser = new Parser()
  const csv = parser.parse(flattenedData)
  return csv
}
