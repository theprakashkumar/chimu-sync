// Pre-configured Axios HTTP client for making API requests in the application.
import { CustomError } from "@/types/custom.error.type";
import axios from "axios";
import { refreshTokenMutationFn } from "./api";

// Define default options for the Axios instance:
// - baseURL: All requests will be prefixed with this URL.
// - withCredentials: Send cookies and authentication headers with requests.
// - timeout: Requests will fail if they take longer than 10 seconds.
const options = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
};

const API = axios.create(options);

// Set up a response interceptor:
// - If the response is successful, just return it.
// - If there is an error and the response indicates "Unauthorized" (HTTP 401),
//   redirect the user to the root path ("/"), which is likely the login page.
// - For all errors, reject the promise with the error data.
API.interceptors.response.use(
  (response) => {
    // Pass through successful responses.
    return response;
  },
  async (error) => {
    const { data, status } = error.response;

    // If any of these error occurred then redirect to login page.
    // if (data === "ACCESS_UNAUTHORIZED" && status === 401) {
    //   window.location.href = "/";
    // }

    if (data === "Unauthorized" && status === 401) {
      // Call refresh token endpoint
      await refreshTokenMutationFn();
    }

    // Reject with the error data for further handling.
    const customError: CustomError = {
      ...error,
      errorCode: data?.errorCode || "UNKNOWN_ERROR",
    };

    return Promise.reject({
      customError,
    });
  }
);

export default API;