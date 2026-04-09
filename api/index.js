import { createRequire } from "module";
const require = createRequire(import.meta.url);

const app = require("../apps/api/dist/index.cjs");

export default async function (req, res) {
    // Find the Elysia instance in the CJS module
    // In CJS, the export might be directly the object or under .default
    const elysia = app.default || app;

    if (!elysia || typeof elysia.handle !== 'function') {
        res.statusCode = 500;
        res.end("API Internal Server Error: Elysia handler not found in CJS bundle");
        return;
    }

    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const url = new URL(req.url, `${protocol}://${host}`);

    // Create a Web Standard Request from Node.js req
    const request = new Request(url.href, {
        method: req.method,
        headers: req.headers,
        body: req.method !== 'GET' && req.method !== 'HEAD' ? req : undefined,
        duplex: 'half'
    });

    try {
        const response = await elysia.handle(request);
        
        // Set headers
        res.statusCode = response.status;
        response.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });

        // Transfer body
        const body = await response.arrayBuffer();
        res.end(Buffer.from(body));
    } catch (error) {
        console.error("Bridge Error (CJS):", error);
        res.statusCode = 500;
        res.end("Internal Server Error");
    }
}
