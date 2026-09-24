import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import env from "./env";

import authHelper from "../../utils/auth";

const blogApi: AxiosInstance =
  axios.create({
    baseURL:
      env.apiBaseUrl,

    timeout: 30_000,

    headers: {
      Accept:
        "application/json",

      "Content-Type":
        "application/json",
    },

    withCredentials: false,
  });

/* =========================================================
   REQUEST
========================================================= */

blogApi.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig
  ) => {
    const accessToken =
      authHelper.getAccessToken();

    const guestToken =
      authHelper.getGuestToken();

    /*
     * ADMIN
     */

    if (accessToken) {
      config.headers.set(
        "Authorization",
        `Bearer ${accessToken}`
      );

      config.headers.delete(
        "X-Guest-Token"
      );
    }

    /*
     * GUEST
     */

    else if (guestToken) {
      config.headers.set(
        "X-Guest-Token",
        guestToken
      );
    }

    /*
     * FormData
     */

    if (
      config.data instanceof
      FormData
    ) {
      config.headers.delete(
        "Content-Type"
      );
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);

/* =========================================================
   CAPTURE GUEST TOKEN
========================================================= */

const captureGuestToken =
  (
    headers: unknown
  ): void => {
    if (
      !headers ||
      typeof headers !==
        "object"
    ) {
      return;
    }

    const responseHeaders =
      headers as Record<
        string,
        string
      >;

    const guestToken =
      responseHeaders[
        "x-guest-token"
      ];

    if (guestToken) {
      authHelper.setGuestToken(
        guestToken
      );
    }
  };

/* =========================================================
   RESPONSE
========================================================= */

blogApi.interceptors.response.use(
  (
    response: AxiosResponse
  ) => {
    captureGuestToken(
      response.headers
    );

    return response;
  },

  async (
    error: AxiosError
  ) => {
    if (
      error.response?.headers
    ) {
      captureGuestToken(
        error.response
          .headers
      );
    }

    /*
     * Only clear JWT authentication
     * for actual authenticated requests.
     */

    if (
      error.response
        ?.status === 401 &&
      authHelper.getAccessToken()
    ) {
      authHelper.clearAuth();
    }

    return Promise.reject(
      error
    );
  }
);

export default blogApi;