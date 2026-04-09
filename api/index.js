import * as apiModule from "../apps/api/dist/index.js";

export default async function (req, res) {
    // Find the Elysia instance (handle both ESM and CJS default exports)
    let elysiaServer = apiModule.default || apiModule;
    if (elysiaServer && elysiaServer.default && typeof elysiaServer.handle !== 'function') {
        elysiaServer = elysiaServer.default;
    }

    if (!elysiaServer || typeof elysiaServer.handle !== 'function') {
        res.statusCode = 500;
        res.end("API Internal Server Error: Handler not found");
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
        // Duplex is required for streaming bodies in some versions of Node/Vercel
        duplex: 'half'
    });

    try {
        const response = await elysiaServer.handle(request);
        
        // Set headers
        res.statusCode = response.status;
        response.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });

        // Transfer body
        const body = await response.arrayBuffer();
        res.end(Buffer.from(body));
    } catch (error) {
        console.error("Bridge Handler Error:", error);
        res.statusCode = 500;
        res.end("Internal Server Error");
    }
}
