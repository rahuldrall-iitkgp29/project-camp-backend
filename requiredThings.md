# Project Audit & Required Fixes

This document is a technical audit of the project based on the PRD and current implementation.

---

## Step 3 — Tell me exactly what remains to build

### Completed
These features have been implemented and have corresponding routes, controllers, and models (though some contain bugs, which are detailed in the dry run section):
*   **User Registration:** Controller and route exist, validation applied.
*   **User Login:** JWT-based authentication implemented.
*   **User Logout:** Implemented.
*   **Email Verification:** Controller logic and token generation exist.
*   **Token Refresh:** Controller logic exists.
*   **Forgot/Reset Password:** Endpoints and email sending logic exist.
*   **Project CRUD (Create, Read, Update, Delete):** Controllers exist and are mounted.
*   **Team Member Management:** Add, get, update role, and delete member controllers are mapped to routes.
*   **System Health Check:** Basic health endpoint is functional.

### Partially Completed
*   **Get Current User:** 
    *   *What PRD requires:* `GET /api/v1/auth/current-user`
    *   *What exists:* Mapped as `POST /current-user` instead of `GET`, and it has the `userChanggedCurrentPasswordValidator` incorrectly attached to it.
    *   *Missing:* Needs to be changed to a GET request and the incorrect validator needs to be removed.
    *   *Priority:* High
*   **Change Password:**
    *   *What PRD requires:* `POST /api/v1/auth/change-password`
    *   *What exists:* Controller `changeCurrentPassword` exists in `auth.controler.js`, but it is **never imported or mounted** in `auth.route.js`.
    *   *Missing:* Needs to be mapped to a route.
    *   *Priority:* High
*   **Role-Based Access Control (RBAC):**
    *   *What PRD requires:* Three-tier permission system enforced by middleware.
    *   *What exists:* `validateProjectPermission` middleware exists but is fundamentally broken (it doesn't return the async handler, and references misspelled variables).
    *   *Missing:* Needs syntactic and logical fixes to actually protect the endpoints.
    *   *Priority:* Critical
*   **Task Management (Core Task CRUD):**
    *   *What PRD requires:* Full task lifecycle including file attachments.
    *   *What exists:* `task.controler.js` exists with `createTask` and `getTasks`, `getTaskById` implemented. However, update and delete controllers are completely empty. Furthermore, **no task routes are mounted in `app.js` or `routes/`**. 
    *   *Missing:* Finish empty controllers and create/mount `task.route.js`.
    *   *Priority:* High

### Not Implemented
*   **Subtask Management:**
    *   *What PRD requires:* Create, update, delete, and mark complete for subtasks.
    *   *What exists:* `Subtask` model exists, and empty placeholder functions exist in `task.controler.js`. No logic is implemented.
    *   *Missing:* Full business logic and routing.
    *   *Priority:* Medium
*   **Project Notes:**
    *   *What PRD requires:* Full CRUD for project notes (Admin only).
    *   *What exists:* Only the `note.models.js` exists. There are no controllers and no routes.
    *   *Missing:* Controllers, validation, routes, and mounting.
    *   *Priority:* Medium

---

## 🚨 Errors Found During Dry Run

**Error: Express route mounting crash (Undefined Middleware)**
*   **Location:** `src/middlewares/auth.middleware.js` (line 38) and `src/routes/project.route.js`
*   **Why:** `validateProjectPermission` calls `asyncHandler` but forgets to `return` its result. When `project.route.js` mounts the middleware, it passes `undefined` instead of a function, which will cause Express to crash immediately on startup.
*   **Severity:** Critical
*   **Trigger:** Application startup.

**Error: Syntax crash on delete project member route**
*   **Location:** `src/routes/project.route.js` (line 67-68)
*   **Why:** You have `validateProjectPermission([UserRolesEnum.ADMIN]).deleteMember`. This calls `.deleteMember` directly on the returned middleware value instead of passing it as the next argument separated by a comma (`, deleteMember`).
*   **Severity:** Critical
*   **Trigger:** Application startup / Syntax parser.

**Error: Incorrect Model Imports for Project and ProjectMember**
*   **Location:** `src/controllers/project.controlers.js` (lines 2-3)
*   **Why:** The code does `import { Project } from "../models/user.models.js"` and `import { ProjectMember } from "../models/user.models.js"`. These models do not live in the user models file.
*   **Severity:** Critical
*   **Trigger:** Execution of any project-related endpoint.

**Error: Modifying the imported Mongoose Model instead of a document**
*   **Location:** `src/controllers/auth.controler.js` (lines 181-191)
*   **Why:** In `verifyEmail`, `await User.findOne(...)` is called without assigning the result to a variable (`const user = ...`). Later on line 186, it checks `if(!user) { ... } user.emailVerficationToken = undefined`. Because `user` isn't scoped locally, JavaScript falls back to the imported module `user` from line 7 (`import user from "../models/user.models.js";`), trying to modify the Mongoose Model itself.
*   **Severity:** High
*   **Trigger:** A user clicking the email verification link.

**Error: ReferenceError for `moongoose`**
*   **Location:** `src/middlewares/auth.middleware.js` (lines 46-47)
*   **Why:** Typo: `new moongoose.Types.ObjectId(projectId)`. It is spelled `moongoose` instead of `mongoose`.
*   **Severity:** Critical
*   **Trigger:** Attempting to access any protected project route.

**Error: ReferenceError for `project` in `updateProject`**
*   **Location:** `src/controllers/project.controlers.js` (line 120)
*   **Why:** The code runs `await Project.findByIdAndUpdate(...)` but does not capture the result (e.g., `const project = ...`). Later on line 120, it runs `if(!project)`, which throws a ReferenceError.
*   **Severity:** High
*   **Trigger:** Admin updating a project's details.

**Error: ReferenceError for `projects` in `getProjects`**
*   **Location:** `src/controllers/project.controlers.js` (line 65)
*   **Why:** The aggregation result is stored in `const project = await ProjectMember.aggregate(...)`. But the response returns `projects` (plural), which is undefined.
*   **Severity:** High
*   **Trigger:** Fetching the list of user projects.

**Error: Typo `.josn` causing a TypeError**
*   **Location:** `src/controllers/auth.controler.js` (line 282)
*   **Why:** In `refreshAccessToken`, the response is chained with `.josn(...)` instead of `.json(...)`.
*   **Severity:** High
*   **Trigger:** Access token expiration / refresh request.

**Error: Unused mapped array and ReferenceError for `attachements`**
*   **Location:** `src/controllers/task.controler.js` (lines 40-57)
*   **Why:** In `createTask`, `files.map(...)` is executed but its return value isn't assigned to any variable. Later, the model creation uses `attachements` which was never defined anywhere in the scope.
*   **Severity:** High
*   **Trigger:** Creating a task.

**Error: Incorrect Response signature format**
*   **Location:** `src/controllers/project.controlers.js` (line 231)
*   **Why:** `res.status(200).json(200, projectmembers, "project members fetched")` passes multiple arguments directly into `.json()`, skipping the `new ApiRespones(...)` constructor wrapper used everywhere else.
*   **Severity:** Medium
*   **Trigger:** Fetching all members of a project.

---

## Step 6 — Final project status

### Project Completion
**Estimated completion:** ~50%
The foundation (database, models, authentication, project structure) is built, but major pillars (Tasks, Subtasks, Notes) are either completely unrouted or missing business logic, and critical syntax errors block the existing ones from running.

### Current State
*   **Foundation:** Complete
*   **Authentication:** Complete (Logic is mostly done, needs minor routing/variable fixes)
*   **Project CRUD:** Complete (Needs typo/import fixes to run)
*   **Role-Based Access (RBAC):** Broken (Middleware syntax is flawed)
*   **Task/Subtask/Notes:** Incomplete (Empty controllers, missing routes, detached logic)

### Remaining Work (Priority Order)
1.  **High Priority (Fix Crashing Bugs):** Fix the `validateProjectPermission` middleware, the `.deleteMember` route syntax error, and the broken imports in `project.controlers.js`. Currently, the app will not compile/start properly.
2.  **High Priority (Fix Auth Flow):** Fix `verifyEmail` variable scoping, map `changeCurrentPassword` to `auth.route.js`, change `/current-user` to a `GET` request, and fix `.josn` typo.
3.  **Medium Priority (Task & Routing Implementation):** Fix the `attachements` variable issue in `createTask`, finish the empty Task update/delete controllers, and create `task.route.js`. Mount it in `app.js`.
4.  **Medium Priority (Notes & Subtasks):** Write controllers and routes for Subtasks and Notes according to the PRD.

### Biggest Risks
*   **Lack of Testing / Syntax Checks:** There are multiple ReferenceErrors and syntax errors (e.g., calling `.deleteMember` on middleware, spelling `moongoose`) that indicate the code hasn't been successfully spun up and tested locally yet. 
*   **Middleware Implementation:** The RBAC logic (`validateProjectPermission`) serves as the gatekeeper for almost every action in the application. Its current structural issues mean security is fully bypassed (or strictly crashes), putting data integrity at risk until repaired.
