import React, { useCallback, useState } from "react";
import { DropZone, Button } from "@shopify/polaris";
import axios from "axios";
import { useAppBridge } from "@shopify/app-bridge-react";
import { getSessionToken } from "@shopify/app-bridge-utils";

export default function FileUpload() {
  const app = useAppBridge();
  const [file, setFile] = useState();
  const handleDropZoneDrop = async (event) => {
    const formData = new FormData();
    formData.append("file", event.target.files[0]);
    formData.append("fileName", event.target.files[0].name);

    try {
      const instance = await axios.create();
      // Intercept all requests on this Axios instance
      instance.interceptors.request.use(function (config) {
        return getSessionToken(app) // requires a Shopify App Bridge instance
          .then((token) => {
            // Append your request headers with an authenticated token
            config.headers["Authorization"] = `Bearer ${token}`;
            return config;
          });
      });

      instance.get(`${app.localOrigin}/rest/themes`).then((data) => {
        console.log(data);
        instance
          .put(
            `${app.localOrigin}/rest/theme/${data.data.body.themes[0].id}/assets`,
            formData
          )
          .then((response) => console.log(response))
          .then((error) => consolr.log(error));
      });
    } catch (error) {
      console.log(error);
    }
  };

  return <input type="file" onChange={handleDropZoneDrop} />;
}
