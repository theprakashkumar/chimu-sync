// This file sets up a pre-configured Axios HTTP client for making API requests in the application.

// Import the Axios library for HTTP requests.
import { CustomError } from "@/types/custom.error.type";
import axios from "axios";

// Get the base URL for the API from environment variables.
const baseURL = import.meta.env.VITE_API_BASE_URL;

// Define default options for the Axios instance:
// - baseURL: All requests will be prefixed with this URL.
// - withCredentials: Send cookies and authentication headers with requests.
// - timeout: Requests will fail if they take longer than 10 seconds.
const options = {
  baseURL,
  withCredentials: true,
  timeout: 10000,
};

// Create an Axios instance with the above options.
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
    if (data === "ACCESS_UNAUTHORIZED") {
      window.localStorage.href = "/";
      return;
    }

    if (data === "Unauthorized" && status === 401) {
      // Redirect to login if unauthorized.
      window.location.href = "/";
      return;
    }

    // Reject with the error data for further handling.
    const customError: CustomError = {
      ...error,
      errorCode: data?.errorCode || "UNKNOWN_ERROR",
    };

    return Promise.reject({
      ...customError,
    });
  }
);

// Export the configured Axios instance for use throughout the app.
export default API;
