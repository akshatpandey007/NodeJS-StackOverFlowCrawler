import axios from "axios";
import { urlConfig } from "./config.js";
import Response from "./response.js";

export default async function request(url, callback) {
  try {
    url = urlConfig.nomalizeUrl(url);
    const res = await axios.get(url);
    callback(
      null,
      new Response({
        htmlPage: res.data,
        isQuestionPage: !urlConfig.isRootPage(url),
      })
    );
  } catch (err) {
    callback(err, null);
  }
}
