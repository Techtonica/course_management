import "./ProgressIndicator.css"

const ProgressIndicator = ({ status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return "✓"
      case "in_progress":
        return "◐"
      case "not_started":
        return "○"
      default:
        return "○"
    }
  }

  const getStatusClass = () => {
    switch (status) {
      case "completed":
        return "progress-completed"
      case "in_progress":
        return "progress-in-progress"
      case "not_started":
        return "progress-not-started"
      default:
        return "progress-not-started"
    }
  }

  return <span className={`progress-indicator ${getStatusClass()}`}>{getStatusIcon()}</span>
}

export default ProgressIndicator
