import State from "./State.js";
import { UrlUtils } from "./utils.js";

export const urlConfig = new UrlUtils({
  url: "https://stackoverflow.com",
  parameters: ["questions"],
});

export const state = new State();
