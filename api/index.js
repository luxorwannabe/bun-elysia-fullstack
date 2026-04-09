import * as api from "../apps/api/dist/index.js";

// Bridge to handle both ESM default and potential CJS wrapper
const app = api.default || api;

export default async function (request) {
  if (!app || typeof app.handle !== 'function') {
    // One more check in case of deep default nesting
    const actualApp = app.default || app;
    return actualApp.handle(request);
  }
  return app.handle(request);
}
