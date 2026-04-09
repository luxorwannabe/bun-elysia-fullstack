export default async function (req, res) {
    const start = Date.now();
    console.log(`[${start}] BRIDGE_TRIGGERED: ${req.url}`);

    try {
        // Dynamic import inside the handler to isolate initialization side-effects
        const appModule = await import("../apps/api/dist/index.js");
        const importTime = Date.now() - start;
        console.log(`[${Date.now()}] IMPORT_DONE in ${importTime}ms. Root keys:`, Object.keys(appModule));

        let elysia = appModule;
        let depth = 0;
        while (elysia && typeof elysia.handle !== 'function' && elysia.default && depth < 5) {
            elysia = elysia.default;
            depth++;
            console.log(`[${Date.now()}] DRILLING_DEPTH_${depth}. Keys:`, Object.keys(elysia));
        }

        if (!elysia || typeof elysia.handle !== 'function') {
            console.error(`[${Date.now()}] ELYSIA_NOT_FOUND. Final object type:`, typeof elysia);
            res.statusCode = 500;
            res.end(`API Error: Elysia instance not found. Search depth: ${depth}`);
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

        const response = await elysia.handle(request);
        const handleTime = Date.now() - start - importTime;
        console.log(`[${Date.now()}] ELYSIA_HANDLED in ${handleTime}ms. Status: ${response.status}`);
        
        res.statusCode = response.status;
        response.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });

        const body = await response.arrayBuffer();
        res.end(Buffer.from(body));

    } catch (error) {
        const errorTime = Date.now() - start;
        console.error(`[${Date.now()}] BRIDGE_CRASHED after ${errorTime}ms:`, error);
        res.statusCode = 500;
        res.end(`Internal Server Error: ${error.message}`);
    }
}
