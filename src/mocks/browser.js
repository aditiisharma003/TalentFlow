// src/mocks/browser.js
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// Start MSW in browser
export const worker = setupWorker(...handlers);