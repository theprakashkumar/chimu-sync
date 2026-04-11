import API from "./axios-client";
import {
  AllMembersInWorkspaceResponseType,
  AllProjectPayloadType,
  AllProjectResponseType,
  AllTaskPayloadType,
  AllTaskResponseType,
  AllWorkspaceResponseType,
  AnalyticsResponseType,
  ChangeWorkspaceMemberRoleType,
  CreateProjectPayloadType,
  CreateTaskPayloadType,
  CreateWorkspaceResponseType,
  CreateWorkspaceType,
  CurrentUserResponseType,
  EditProjectPayloadType,
  EditWorkspaceType,
  forgotPasswordType,
  LoginResponseType,
  loginType,
  ProjectByIdPayloadType,
  ProjectResponseType,
  registerType,
  resetPasswordType,
  UserType,
  verifyEmail,
  WorkspaceByIdResponseType,
} from "@/types/api.type";

const loginMutationFn = async (
  data: loginType
): Promise<LoginResponseType> => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

const refreshTokenMutationFn = async (): Promise<void> => {
  await API.post('/auth/refresh');
}

const registerMutationFn = async (
  data: registerType
): Promise<UserType> => {
  const response = await API.post("/auth/register", data);
  return response.data;
};

const verifyEmailMutationFn = async (data: verifyEmail) => {
  return API.post("/auth/verify/email", data);
}

const logoutMutationFn = async () => {
  return await API.post("/auth/logout");
};

const forgotPasswordMutationFn = async (data: forgotPasswordType) => {
  return API.post('/auth/password/forgot', data);
}

const resetPasswordMutationFn = async (data: resetPasswordType) => {
  return API.post('/auth/password/reset', data);
}

const getCurrentUserQueryFn =
  async (): Promise<CurrentUserResponseType> => {
    const response = await API.get(`/user/current`);
    return response.data;
  };

// WORKSPACE

const createWorkspaceMutationFn = async (
  data: CreateWorkspaceType
): Promise<CreateWorkspaceResponseType> => {
  const response = await API.post("workspace/create/new", data);
  return response.data;
};

const editWorkspaceMutationFn = async ({
  workspaceId,
  data,
}: {
  workspaceId: string;
  data: { name: string; description: string };
}): Promise<EditWorkspaceType> => {
  const response = await API.put(`/workspace/update/${workspaceId}`, data);
  return response.data;
};

const getWorkspaceByIdQueryFn = async (
  workspaceId: string
): Promise<WorkspaceByIdResponseType> => {
  const response = await API.get(`/workspace/${workspaceId}`);
  return response.data;
};

const getAllWorkspacesUserIsMemberQueryFn =
  async (): Promise<AllWorkspaceResponseType> => {
    const response = await API.get("/workspace/all");
    return response.data;
  };

const getMembersInWorkspaceQueryFn = async (
  workspaceId: string
): Promise<AllMembersInWorkspaceResponseType> => {
  const response = await API.get(`/workspace/members/${workspaceId}`);
  return response.data;
};

const getWorkspaceAnalyticsQueryFn = async (
  workspaceId: string
): Promise<AnalyticsResponseType> => {
  const response = await API.get(`workspace/analytics/${workspaceId}`);
  return response.data;
};

const changeWorkspaceMemberRoleMutationFn = async ({
  workspaceId,
  data,
}: ChangeWorkspaceMemberRoleType) => {
  const response = await API.put(
    `/workspace/change/member/role/${workspaceId}`,
    data
  );
  return response.data;
};

const deleteWorkspaceMutationFn = async (
  workspaceId: string
): Promise<{ message: string; currentWorkspace: string }> => {
  const response = await API.delete(`workspace/delete/${workspaceId}`);
  return response.data;
};

// MEMBER
const invitedUserJoinWorkspaceMutationFn = async (
  inviteCode: string
): Promise<{
  message: string;
  workspaceId: string;
}> => {
  const response = await API.post(`/member/workspace/${inviteCode}/join`);
  return response.data;
};

//PROJECTS
const createProjectMutationFn = async ({
  workspaceId,
  data,
}: CreateProjectPayloadType): Promise<ProjectResponseType> => {
  const response = await API.post(
    `/project/workspace/${workspaceId}/create`,
    data
  );
  return response.data;
};

const editProjectMutationFn = async ({
  projectId,
  workspaceId,
  data,
}: EditProjectPayloadType): Promise<ProjectResponseType> => {
  const response = await API.put(
    `/project/${projectId}/workspace/${workspaceId}/update`,
    data
  );
  return response.data;
};

const getProjectsInWorkspaceQueryFn = async ({
  workspaceId,
  pageSize = 10,
  pageNumber = 1,
}: AllProjectPayloadType): Promise<AllProjectResponseType> => {
  const response = await API.get(
    `/project/workspace/${workspaceId}/all?pageSize=${pageSize}&pageNumber=${pageNumber}`
  );
  return response.data;
};

const getProjectByIdQueryFn = async ({
  projectId,
  workspaceId,
}: ProjectByIdPayloadType): Promise<ProjectResponseType> => {
  const response = await API.get(
    `/project/${projectId}/workspace/${workspaceId}`
  );

  return response.data;
};

const getProjectAnalyticsQueryFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<AnalyticsResponseType> => {
  const response = await API.get(
    `/project/${projectId}/workspace/${workspaceId}/analytics`
  );
  return response.data;
};

const deleteProjectMutationFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<{ message: string }> => {
  const response = await API.delete(
    `/project/${projectId}/workspace/${workspaceId}/delete`
  );
  return response.data;
};

//TASKS

const createTaskMutationFn = async ({
  workspaceId,
  projectId,
  data,
}: CreateTaskPayloadType) => {
  const response = await API.post(
    `/task/project/${projectId}/workspace/${workspaceId}/create`,
    data
  );

  return response.data;
};

const getAllTasksQueryFn = async ({
  workspaceId,
  keyword,
  projectId,
  assignedTo,
  priority,
  status,
  dueDate,
  pageNumber,
  pageSize,
}: AllTaskPayloadType): Promise<AllTaskResponseType> => {
  const baseUrl = `/task/workspace/${workspaceId}/all`;

  const queryParams = new URLSearchParams();
  if (keyword) queryParams.append("keyword", keyword);
  if (projectId) queryParams.append("projectId", projectId);
  if (assignedTo) queryParams.append("assignedTo", assignedTo);
  if (priority) queryParams.append("priority", priority);
  if (status) queryParams.append("status", status);
  if (dueDate) queryParams.append("dueDate", dueDate);
  if (pageNumber) queryParams.append("pageNumber", pageNumber?.toString());
  if (pageSize) queryParams.append("pageSize", pageSize?.toString());

  const url = queryParams.toString() ? `${baseUrl}?${queryParams}` : baseUrl;

  const response = await API.get(url);

  return response.data;
};

const deleteTaskMutationFn = async () => { };

export {
  loginMutationFn,
  refreshTokenMutationFn,
  registerMutationFn,
  verifyEmailMutationFn,
  logoutMutationFn,
  forgotPasswordMutationFn,
  resetPasswordMutationFn,
  getCurrentUserQueryFn,
  createWorkspaceMutationFn,
  editWorkspaceMutationFn,
  getWorkspaceByIdQueryFn,
  getAllWorkspacesUserIsMemberQueryFn,
  getMembersInWorkspaceQueryFn,
  getWorkspaceAnalyticsQueryFn,
  changeWorkspaceMemberRoleMutationFn,
  deleteWorkspaceMutationFn,
  invitedUserJoinWorkspaceMutationFn,
  createProjectMutationFn,
  editProjectMutationFn,
  getProjectsInWorkspaceQueryFn,
  getProjectByIdQueryFn,
  getProjectAnalyticsQueryFn,
  deleteProjectMutationFn,
  createTaskMutationFn,
  getAllTasksQueryFn,
  deleteTaskMutationFn,
};
