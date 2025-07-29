const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");
const Document = require("../models/Document");
const Project = require("../models/Project");

const router = express.Router();

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Upload a document (Admin or Lead)
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  const { projectId } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ msg: "Project not found" });

    if (req.user.role === "Developer")
      return res.status(403).json({ msg: "Developers cannot upload documents" });

    if (req.user.role === "ProjectLead" && String(project.lead) !== req.user.id)
      return res.status(403).json({ msg: "Not the lead of this project" });

    const doc = new Document({
      project: projectId,
      fileName: req.file.originalname,
      filePath: req.file.path,
      uploadedBy: req.user.id
    });

    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// View all documents for a project (if user is assigned)
router.get("/:projectId", auth, async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ msg: "Project not found" });

    const isAssigned =
      req.user.role === "Admin" ||
      req.user.role === "ProjectLead" && String(project.lead) === req.user.id ||
      req.user.role === "Developer" && project.assignedDevs.includes(req.user.id);

    if (!isAssigned) return res.status(403).json({ msg: "Access denied to documents" });

    const docs = await Document.find({ project: projectId }).populate("uploadedBy", "name");
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
