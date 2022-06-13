import axios, { Method } from "axios";
import CryptoJS from "crypto-js";
import { APIS } from "../constants";
import { useAuthToken } from "../contexts/authProvider";
import { useLocalCache } from "../hooks/useLocalCache";
import { notify } from "./notifications";

export const ApiUtils = () => {
  const { authToken, removeAuthToken } = useAuthToken();
  const localCache = useLocalCache();

  const axiosInstance = axios.create({
    timeout: 60000,
    headers: { "Content-Type": "application/json" },
  });

  async function runOthersAPI(props: {
    method: Method;
    url: string;
    data?: string | FormData;
    useCache?: boolean;
    showError?: boolean;
  }) {
    axiosInstance.defaults.baseURL = APIS.base_others_api_url;
    let cacheKey = APIS.base_others_api_url + props.url;
    if (props.data && typeof props.data === "string") {
      cacheKey = cacheKey + props.data;
    }
    cacheKey = CryptoJS.SHA256(cacheKey).toString(CryptoJS.enc.Base64);
    if (props.useCache) {
      const cached = await localCache.getItem(cacheKey);
      if (cached) {
        return JSON.parse(cached.data);
      }
    }

    try {
      const res = await axiosInstance.request({
        method: props.method,
        url: props.url,
        data: props.data,
      });
      if (res.status === 200) {
        if (props.useCache) {
          await localCache.setItem(cacheKey, JSON.stringify(res.data));
        }
        return res.data;
      } else {
        if (props.showError) {
          notify({
            message: res.data.message,
            type: "error",
          });
        }
      }
    } catch (err: any) {
      console.error("runOthersAPI error", err);
      if (props.showError) {
        notify({
          message: err.message,
          type: "error",
        });
      }
    }

    return {};
  }

  async function runAPI(props: {
    isAuth: boolean;
    method: Method;
    url: string;
    data?: string | FormData;
    showError?: boolean;
    useCache?: boolean;
  }) {
    axiosInstance.defaults.baseURL = APIS.base_api_url;
    let cacheKey = APIS.base_api_url + props.url;
    if (props.data && typeof props.data === "string") {
      cacheKey = cacheKey + props.data;
    }
    cacheKey = CryptoJS.SHA256(cacheKey).toString(CryptoJS.enc.Base64);
    if (props.useCache) {
      const cached = await localCache.getItem(cacheKey);
      if (cached) {
        return JSON.parse(cached.data);
      }
    }
    if (props.isAuth) {
      axiosInstance.defaults.headers.common["x-access-token"] = authToken;
    }
    if (props.data) {
      if (typeof props.data !== "string") {
        axiosInstance.defaults.headers.common[
          "Content-Type"
        ] = `multipart/formdata; boundary=${Date.now()}`;
      }
    }

    try {
      const res = await axiosInstance.request({
        method: props.method,
        url: props.url,
        data: props.data,
      });

      if (res.status === 200) {
        if (props.useCache) {
          await localCache.setItem(cacheKey, JSON.stringify(res.data));
        }
        return res.data;
      } else {
        if (res.status === 401) {
          removeAuthToken();
        }
        if (props.showError) {
          notify({
            message: res.data.error.message,
            type: "error",
          });
        }
      }
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        removeAuthToken();
      }
      if (props.showError) {
        let errMessage = err.message;
        if (err.response && err.response.data) {
          errMessage = err.response.data.error
            ? err.response.data.error.message
            : err.response.data.details;
        }
        notify({
          message: errMessage,
          type: "error",
        });
      }
    }

    return {};
  }

  return {
    runAPI,
    runOthersAPI,
  };
};
