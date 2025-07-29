const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const projectRoutes = require("./routes/project");
const authRoutes = require("./routes/auth");
const connectDb=require("./Data/db")
const userRoutes = require("./routes/users");
const documentRoutes = require("./routes/document");


const app = express();
app.use(cors());
app.use(express.json());

connectDb();

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/users", userRoutes);

app.use("/uploads", express.static("uploads"));

app.listen(process.env.PORT|| 5000, () => console.log("Server running on port 5000"));
