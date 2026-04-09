import app from "../apps/api/dist/index.js";

export default async function (request) {
  return app.handle(request);
}
