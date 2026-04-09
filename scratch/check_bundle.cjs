const app = require('../apps/api/dist/index.cjs');
console.log('Bundle Keys:', Object.keys(app));
console.log('Bundle type:', typeof app);
console.log('Bundle default type:', typeof app.default);
if (app.default) {
    console.log('Bundle default keys:', Object.keys(app.default));
    console.log('Is handle a function on default?', typeof app.default.handle === 'function');
}
console.log('Is handle a function on top level?', typeof app.handle === 'function');
