import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import env from "./env";
import authHelper from "../../utils/auth";

const blogApi: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 30_000,

  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },

  withCredentials: false,
});

/**
 * Request interceptor
 *
 * Blog API supports two identities:
 *
 * 1. Admin
 *    Authorization: Bearer <JWT>
 *
 * 2. Guest visitor
 *    X-Guest-Token: <guest-token>
 */
blogApi.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig,
  ) => {
    const accessToken =
      authHelper.getAccessToken();

    const guestToken =
      authHelper.getGuestToken();

    /**
     * Authenticated admin
     */
    if (accessToken) {
      config.headers.set(
        "Authorization",
        `Bearer ${accessToken}`,
      );

      config.headers.delete(
        "X-Guest-Token",
      );
    }

    /**
     * Anonymous visitor
     */
    else if (guestToken) {
      config.headers.set(
        "X-Guest-Token",
        guestToken,
      );
    }

    /**
     * Let the browser/Axios automatically
     * create the multipart boundary when
     * FormData is used.
     */
    if (config.data instanceof FormData) {
      config.headers.delete(
        "Content-Type",
      );
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Save guest token returned by backend.
 */
const captureGuestToken = (
  headers: unknown,
): void => {
  if (
    !headers ||
    typeof headers !== "object"
  ) {
    return;
  }

  const responseHeaders =
    headers as Record<string, string>;

  const guestToken =
    responseHeaders["x-guest-token"];

  if (guestToken) {
    authHelper.setGuestToken(
      guestToken,
    );
  }
};

/**
 * Response interceptor
 */
blogApi.interceptors.response.use(
  (response: AxiosResponse) => {
    captureGuestToken(
      response.headers,
    );

    return response;
  },

  async (error: AxiosError) => {
    /**
     * Guest token can also be returned
     * on an error response.
     */
    if (error.response?.headers) {
      captureGuestToken(
        error.response.headers,
      );
    }

    /**
     * Existing JWT authentication behavior.
     */
    if (error.response?.status === 401) {
      authHelper.clearAuth();
    }

    return Promise.reject(error);
  },
);

export default blogApi;