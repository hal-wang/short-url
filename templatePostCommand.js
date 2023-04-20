const fs = require("fs");

fs.renameSync("./.env.temp", "./.env.local");
fs.renameSync("./short-url-api/.env.temp", "./short-url-api/.env.local");

fs.unlinkSync("./templatePostCommand.js");
