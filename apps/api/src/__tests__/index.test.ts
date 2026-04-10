import { describe, it, expect } from "bun:test";
import app from '../index.js';

describe("API Root", () => {
    it("returns health check information", async () => {
        const response = await app.handle(
            new Request("http://localhost/api")
        );
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.status).toBe("success");
        expect(data.message).toContain("Bun Elysia Fullstack API is running");
    });
    
    it("returns swagger documentation path", async () => {
        const response = await app.handle(
            new Request("http://localhost/api")
        );
        const data = await response.json();

        expect(data.docs).toBe("/docs");
    });
});
