# 🚀 PixelForge Nexus

**Secure Role-Based Project Management Platform**  
Created by **Dev Agarwal**

---

## 📚 Overview

**PixelForge Nexus** is a robust full-stack web application designed to streamline project management through a secure, role-based access system. Built with the MERN stack, it facilitates project creation, team assignments, developer task visibility, and document uploads with seamless role segregation.

---

## 👥 Roles and Capabilities

### 🛠️ Admin
- Register new users (Admin / Lead / Developer)
- Create and assign projects to Project Leads
- Manage all users and update their roles

### 👨‍💼 Project Lead
- View and manage assigned projects
- Upload project-related documents securely
- Assign developers to projects

### 👨‍💻 Developer
- View projects they are assigned to
- Track project details and updates

---

## 🔐 Authentication
- JWT-based secure login system
- Role-based protected routes (Admin, Lead, Developer)
- Password hashing with bcrypt

---

## 🧱 Tech Stack

| Tech          | Description               |
|---------------|---------------------------|
| **Frontend**  | React.js, Axios, MUI      |
| **Backend**   | Node.js, Express.js       |
| **Database**  | MongoDB Atlas             |
| **Authentication** | JWT, bcrypt         |

---

## 📁 File Upload Support
- Project Leads can upload documents (PDF, DOCX, etc.)
- Files are stored securely and associated with each project

---

## 🖥️ Setup & Run Locally

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/pixelforge-nexus.git
    ```

2. Navigate into the folders:
    ```bash
    cd server     # for backend
    cd client     # for frontend
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Start backend and frontend servers (in separate terminals):
    ```bash
    npm start
    ```

5. Visit: [http://localhost:3000](http://localhost:3000)

---

## 📹 Demo Video

https://drive.google.com/file/d/1XwW_Crj2rwM-OeQE0MpBRFaNWH4JbVuj/view?usp=drive_link

---

## ✨ Author

Made with 💻 by **Dev Agarwal**  
[GitHub](https://github.com/ROCKYSOUP) • [LinkedIn]https://www.linkedin.com/in/dev-agarwal-713a1b274/

---

## 📄 License

MIT License
