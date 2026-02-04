module.name = 'JS Modules';

const app = require('./app-vue2');
console.log('app', app);

const methods = app.methods || {};
let shared = app.data();
shared = {...shared, ...methods}

const handler = app.simulateHtmlContent.bind(shared);
handler();