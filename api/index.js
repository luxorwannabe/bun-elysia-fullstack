import * as apiModule from "../apps/api/dist/index.js";

export default async function (request) {
  console.log("API Bridge Request to:", request.url);

  // Use a unique variable name to avoid any initialization/TDZ issues
  let elysiaServer = apiModule.default || apiModule;
  
  // Handle tiered wrapping that sometimes occurs in Bun/Node hybrid bundles
  if (elysiaServer && elysiaServer.default && typeof elysiaServer.handle !== 'function') {
    elysiaServer = elysiaServer.default;
  }

  if (!elysiaServer || typeof elysiaServer.handle !== 'function') {
    console.error("Failed to find handle on elysiaServer. Module keys:", Object.keys(apiModule));
    return new Response("API Internal Server Error: Handler not found", { status: 500 });
  }

  return elysiaServer.handle(request);
}
