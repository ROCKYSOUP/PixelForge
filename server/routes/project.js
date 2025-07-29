const express = require("express");
const auth = require("../middleware/auth");
const Project = require("../models/Project");
const User = require("../models/User");

const router = express.Router();

// ✅ Developer - View Assigned Projects (place this BEFORE /:id route)
router.get("/my-projects", auth, async (req, res) => {
  if (req.user.role !== "Developer")
    return res.status(403).json({ msg: "Only developers can view this" });

  try {
    const projects = await Project.find({ assignedDevs: req.user.id ,status:"Active"})
      .populate("lead", "name email")
      .populate("assignedDevs", "name email");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Admin - Add Project
router.post("/add", auth, async (req, res) => {
  if (req.user.role !== "Admin")
    return res.status(403).json({ msg: "Only Admins can add projects" });

  const { name, description, deadline, lead } = req.body;
  try {
    const newProject = new Project({ name, description, deadline, lead });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Get All Active Projects (role-based)
router.get("/", auth, async (req, res) => {
  try {
    let query = { status: "Active" };

    if (req.user.role === "ProjectLead") {
      query.lead = req.user.id; // only their own projects
    }

    const projects = await Project.find(query)
      .populate("lead", "name email")
      .populate("assignedDevs", "name email");

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/lead-projects", auth, async (req, res) => {
  if (req.user.role !== "ProjectLead")
    return res.status(403).json({ msg: "Only Project Leads can view their projects" });

  try {
    const projects = await Project.find({ lead: req.user.id ,status:"Active"})
      .populate("lead", "name email")
      .populate("assignedDevs", "name email");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Get One Project by ID (KEEP THIS BELOW "/my-projects")
router.get("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("lead", "name email")
      .populate("assignedDevs", "name email");

    if (!project) return res.status(404).json({ msg: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update project status
router.put("/:id/status", auth, async (req, res) => {
  if (req.user.role !== "Admin")
    return res.status(403).json({ msg: "Only Admins can update project status" });

  try {
    const { status } = req.body;
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("lead", "name email")
      .populate("assignedDevs", "name email");

    if (!updated) return res.status(404).json({ msg: "Project not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Error updating status" });
  }
});

// ✅ Mark Project as Completed (Admin)
router.patch("/complete/:id", auth, async (req, res) => {
  if (req.user.role !== "Admin")
    return res.status(403).json({ msg: "Only Admins can complete projects" });

  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status: "Completed" },
      { new: true }
    );
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Assign Developer (ProjectLead only)
router.post("/assign-dev", auth, async (req, res) => {
  if (req.user.role !== "ProjectLead")
    return res.status(403).json({ msg: "Only Leads can assign developers" });

  const { projectId, developerId } = req.body;
  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ msg: "Project not found" });

    if (String(project.lead) !== req.user.id)
      return res.status(403).json({ msg: "You are not the lead for this project" });

    if (project.assignedDevs.includes(developerId))
      return res.status(400).json({ msg: "Developer already assigned" });

    project.assignedDevs.push(developerId);
    await project.save();

    const updatedProject = await Project.findById(projectId)
      .populate("lead", "name email")
      .populate("assignedDevs", "name email");

    res.json({ msg: "Developer assigned", project: updatedProject });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
