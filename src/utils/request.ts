import axios from "axios";
import { AxiosInstance, AxiosRequestConfig } from "axios";
import { createDiscreteApi } from "naive-ui";
import { getToken, removeToken } from "@/utils/auth";
import { permissionStore } from "@/store";

const { message, loadingBar } = createDiscreteApi(["message", "loadingBar"]);

const service: AxiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 15000,
});

service.interceptors.request.use(
  (config: any) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `${token}`;
    } else if (location.pathname !== '/login'){
      location.href = '/login';
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response: any) => {
    if (response.data.code === 401) {
      localStorage.removeItem("user");
      removeToken();
      permissionStore().clear();
      message.error("用户身份已失效，请重新登录", {
        onAfterLeave: () => {
          location.href = `/login?redirect=${window.location.pathname + window.location.search}`;
        }
      });
      return;
    }
    return response.data;
  },
  (error: any) => {
    // message.error(error.msg);
    return Promise.reject(error);
  }
);

// 封装axios---------------------------------------
function apiAxios(httpDefault: AxiosRequestConfig) {
  return new Promise((resolve, reject) => {
    loadingBar.start();
    service(httpDefault)
      .then((response: any) => {
        switch (response.code) {
          case 200:
            resolve(response);
            break;
          case 0:
            resolve(response);
            break;
          default:
            message.error(response.msg || "error");
            // reject(response);
        }
      })
      .catch((error: any) => {
        message.error(error?.response?.data?.message || "error");
        reject(error);
      })
      .finally(() => {
        loadingBar.finish();
      });
  });
}

export default apiAxios;
