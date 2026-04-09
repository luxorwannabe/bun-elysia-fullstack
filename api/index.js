/**
 * Vercel Serverless Function bridge for Elysia.
 */
export default async function (req, res) {
    try {
        // Dynamic import to catch potential initialization errors
        const elysiaModule = await import("../apps/api/dist/index.js");
        
        let app = elysiaModule;
        while (app && typeof app.handle !== 'function' && app.default) {
            app = app.default;
        }

        if (!app || typeof app.handle !== 'function') {
            console.error("API Bridge Error: Elysia handler not found.");
            res.statusCode = 500;
            res.end("API Internal Server Error: Handler initialization failed.");
            return;
        }

        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const host = req.headers.host;
        const url = new URL(req.url, `${protocol}://${host}`);

        const request = new Request(url.href, {
            method: req.method,
            headers: req.headers,
            body: req.method !== 'GET' && req.method !== 'HEAD' ? req : undefined,
            duplex: 'half'
        });

        const response = await app.handle(request);
        
        res.statusCode = response.status;
        response.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });

        const body = await response.arrayBuffer();
        res.end(Buffer.from(body));
    } catch (error) {
        console.error("Vercel Bridge Error:", error);
        res.statusCode = 500;
        res.end("Internal Server Error");
    }
}
