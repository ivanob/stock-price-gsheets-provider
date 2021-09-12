"use strict";
const handler = require('../handler');

(async() => {
    console.log(await handler.prices({}))
})();