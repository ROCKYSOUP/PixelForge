const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  deadline: Date,
  status: { type: String, default: "Active" },
  assignedDevs: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  lead: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
