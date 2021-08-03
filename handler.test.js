"use strict";
const handler = require('./src/handler');

(async() => {
    console.log(await handler.prices({}))
})();