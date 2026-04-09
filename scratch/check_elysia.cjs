const elysia = require('elysia');
console.log('Elysia Named Exports:', Object.keys(elysia));
console.log('Elysia Default Export:', typeof elysia.default);
