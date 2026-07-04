export const UserRolesEnum = {
  ADMIN: "admin",
  PROJECT_ADMIN: "project_admin",
  MEMBER: "member",
}; // here we pass an complete object once

export const AvailableUserRole = Object.values(UserRolesEnum);
//here we pass them in an array form ["admin" , "project_admin" , "member"]

export const TaskStatusEnum = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
};

export const AvailableTaskStatus = Object.values(TaskStatusEnum);