const Course = require("../models/Course")

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const isPublicOnly = !req.user || req.user?.role === "participant"
    const courses = await Course.getAll(isPublicOnly)
    res.json(courses)
  } catch (error) {
    console.error("Error fetching courses:", error)
    res.status(500).json({ error: "Failed to fetch courses" })
  }
}

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.getById(req.params.id)
    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }
    res.json(course)
  } catch (error) {
    console.error("Error fetching course:", error)
    res.status(500).json({ error: "Failed to fetch course" })
  }
}

// Create course (admin only)
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body)
    console.log("Course created:", course.id)
    res.status(201).json(course)
  } catch (error) {
    console.error("Error creating course:", error)
    res.status(500).json({ error: "Failed to create course" })
  }
}

// Update course (admin only)
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.update(req.params.id, req.body)
    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }
    console.log("Course updated:", course.id)
    res.json(course)
  } catch (error) {
    console.error("Error updating course:", error)
    res.status(500).json({ error: "Failed to update course" })
  }
}

// Delete course (admin only)
exports.deleteCourse = async (req, res) => {
  try {
    await Course.delete(req.params.id)
    console.log("Course deleted:", req.params.id)
    res.json({ message: "Course deleted successfully" })
  } catch (error) {
    console.error("Error deleting course:", error)
    res.status(500).json({ error: "Failed to delete course" })
  }
}
