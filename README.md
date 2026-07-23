# Project Camp API ⛺️

A robust, RESTful backend API designed to power a collaborative project management system. This service provides the foundational architecture for teams to organize projects, manage hierarchical tasks (with subtasks), securely handle file attachments, and enforce strict role-based access control (RBAC).

## 🚀 Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** [Insert Database, e.g., MongoDB / PostgreSQL]
* **Authentication:** JWT (JSON Web Tokens) & bcrypt
* **File Handling:** Multer

## ✨ Key Features

* **Advanced Authentication & Security:** 
  * Secure user registration and login with JWT and refresh tokens.
  * Account verification via email tokens and secure password reset workflows.
* **Role-Based Access Control (RBAC):** 
  * Three-tier permission system (`Admin`, `Project Admin`, `Member`) protecting all major endpoints.
* **Comprehensive Project & Task Management:**
  * Full CRUD operations for projects, tasks, and subtasks.
  * Three-state status tracking (`Todo`, `In Progress`, `Done`).
* **Team Collaboration:**
  * Secure invitation system to add members to specific projects.
  * Dedicated project notes accessible based on user roles.
* **File Management:**
  * Secure file upload handling using Multer for task attachments, with automated metadata tracking.

## 🛠 Getting Started

### Prerequisites
Make sure you have Node.js and [Database Name] installed on your local machine.

### Installation
cd project-camp-backend
npm install

## 📡 API Reference

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register a new user | No |
| POST | `/api/v1/auth/login` | Authenticate user & get token | No |
| POST | `/api/v1/auth/refresh-token` | Get new access token | Yes |

### Projects
| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/projects/` | Get all projects for user | Member |
| POST | `/api/v1/projects/` | Create a new project | Admin |
| POST | `/api/v1/projects/:id/members`| Add user to project | Admin |

### Tasks
| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/tasks/:projectId` | Get all tasks in project | Member |
| POST | `/api/v1/tasks/:projectId` | Create a new task | Project Admin |

## 🗄️ Database Schema
* **User:** Handles authentication credentials and role assignments.
* **Project:** Core container holding metadata and member references.
* **Task:** Linked to a specific Project and assigned User. Supports hierarchical structure via embedded **Subtasks**.
* **Note:** Project-specific documentation(prd.md) linked to the Project ID.

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/rahuldrall-iitkgp29/project-camp-backend.git](https://github.com/rahuldrall-iitkgp29/project-camp-backend.git)
