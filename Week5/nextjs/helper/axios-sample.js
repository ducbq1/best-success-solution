import axios from "axios";
import { useAppBridge } from "@shopify/app-bridge-react";
import { getSessionToken } from "@shopify/app-bridge-utils";

export default function AxiosSample() {
  const app = useAppBride();
  const instance = axios.create();
  instance.interceptors.request.use(function (config) {
    return getSessionToken(app) // requires a Shopify App Bridge instance
      .then((token) => {
        // Append your request headers with an authenticated token
        config.headers["Authorization"] = `Bearer ${token}`;
        return config;
      });
  });
  instance.get("/route").then((data) => console.log(data));
}
