import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Prevent infinite refresh loops
let isRefreshing = false;
let refreshPromise: Promise<unknown> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const status = err?.response?.status;

    if (!original) return Promise.reject(err);

    // Don't refresh on the refresh endpoint itself
    if (original.url?.includes("/auth/refreshToken")) {
      return Promise.reject(err);
    }

    if (status !== 401) return Promise.reject(err);

    // Don't loop on same request
    if (original._retry) {
      return Promise.reject(err);
    }
    original._retry = true;

    try {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = api.post("/auth/refreshToken");
      }

      await refreshPromise;
      isRefreshing = false;
      refreshPromise = null;

      return api(original);
    } catch (refreshErr) {
      isRefreshing = false;
      refreshPromise = null;
      return Promise.reject(refreshErr);
    }
  }
);
