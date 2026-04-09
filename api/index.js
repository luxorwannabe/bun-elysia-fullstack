import * as apiModule from "../apps/api/dist/index.js";

function findElysia(mod) {
    if (!mod) return null;
    if (typeof mod.handle === 'function') return mod;
    if (mod.default && typeof mod.default.handle === 'function') return mod.default;
    if (mod.default && mod.default.default && typeof mod.default.default.handle === 'function') return mod.default.default;
    return null;
}

export default async function (req, res) {
    console.log("API Bridge Request to:", req.url);

    const elysiaServer = findElysia(apiModule);

    if (!elysiaServer) {
        console.error("Deep search failed. apiModule keys:", Object.keys(apiModule));
        if (apiModule.default) {
            console.error("apiModule.default type:", typeof apiModule.default);
            console.error("apiModule.default keys:", Object.keys(apiModule.default));
        }
        res.statusCode = 500;
        res.end("API Internal Server Error: Handler not found after deep search");
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

    try {
        const response = await elysiaServer.handle(request);
        
        res.statusCode = response.status;
        response.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });

        const body = await response.arrayBuffer();
        res.end(Buffer.from(body));
    } catch (error) {
        console.error("Bridge Handler Error:", error);
        res.statusCode = 500;
        res.end("Internal Server Error");
    }
}
