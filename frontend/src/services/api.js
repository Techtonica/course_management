import axios from "axios"

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token")
      window.location.href = "/"
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  getCurrentUser: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
}

// Users API
export const usersAPI = {
  getAll: () => api.get("/users"),
  getById: (id) => api.get(`/users/${id}`),
  getParticipants: () => api.get("/users/participants"),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
}

// Courses API
export const coursesAPI = {
  getAll: () => api.get("/courses"),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post("/courses", data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
}

// Assignments API
export const assignmentsAPI = {
  getAll: (courseId) => api.get("/assignments", { params: { courseId } }),
  getById: (id) => api.get(`/assignments/${id}`),
  create: (data) => api.post("/assignments", data),
  update: (id, data) => api.put(`/assignments/${id}`, data),
  delete: (id) => api.delete(`/assignments/${id}`),
  bulkAssign: (assignmentId) => api.post("/assignments/bulk-assign", { assignmentId }),
}

// Submissions API
export const submissionsAPI = {
  getAll: (filters) => api.get("/submissions", { params: filters }),
  getById: (id) => api.get(`/submissions/${id}`),
  createOrUpdate: (data) => api.post("/submissions", data),
  updateStatus: (id, status) => api.patch(`/submissions/${id}/status`, { status }),
}

// Feedback API
export const feedbackAPI = {
  getBySubmissionId: (submissionId) => api.get(`/feedback/submission/${submissionId}`),
  create: (data) => api.post("/feedback", data),
  update: (id, data) => api.put(`/feedback/${id}`, data),
  delete: (id) => api.delete(`/feedback/${id}`),
}

// Progress API
export const progressAPI = {
  getByUserId: (userId) => api.get(`/progress/user/${userId}`),
  getByAssignmentId: (assignmentId) => api.get(`/progress/assignment/${assignmentId}`),
  update: (data) => api.put("/progress", data),
}

// Surveys API
export const surveysAPI = {
  getTemplate: (assignmentId) => api.get(`/surveys/template/assignment/${assignmentId}`),
  createTemplate: (data) => api.post("/surveys/template", data),
  updateTemplate: (id, questions) => api.put(`/surveys/template/${id}`, { questions }),
  submitResponse: (data) => api.post("/surveys/response", data),
  getResponses: (assignmentId) => api.get(`/surveys/responses/assignment/${assignmentId}`),
  getUserResponse: (surveyTemplateId) => api.get(`/surveys/response/${surveyTemplateId}`),
}

// Export API
export const exportAPI = {
  submissions: (filters) => api.get("/export/submissions", { params: filters, responseType: "blob" }),
  progress: (filters) => api.get("/export/progress", { params: filters, responseType: "blob" }),
  surveys: (assignmentId) => api.get(`/export/surveys/${assignmentId}`, { responseType: "blob" }),
}

export default api
