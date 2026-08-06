import logs from "./logs/index.js";

import rabbitmq from "./rabbitmq/index.js";

import serviceStorage from "./storage/index.js";


import FILE_CONSTANTS from "./constants/index.js";

const shared = {
    logs,
    rabbitmq,
    serviceStorage,
    FILE_CONSTANTS
}

export default shared;