import * as api from "../apps/api/dist/index.js";

export default async function (request) {
  // Move detection inside the handler to avoid "before initialization" errors
  const instance = api.default || api;
  const app = (instance && typeof instance.handle !== 'function' && instance.default) 
    ? instance.default 
    : instance;
    
  if (!app || typeof app.handle !== 'function') {
    throw new Error("Elysia instance not found in bundle. Check build exports.");
  }

  return app.handle(request);
}
