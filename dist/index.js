"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var func_1 = require("./func");
function main() {
    // Create a new express application instance
    var app = (0, express_1["default"])();
    // The port the express app will listen on
    var port = 3001;
    app.use('/hi', function (w, r) {
        r.send("hi");
    });
    app.use('/w', function (w, r) { (0, func_1.welcome)(w, r); });
    app.use('/jt', function (w, r) { (0, func_1.jsonType)(w, r); });
    app.use('/', function (w, r) {
        r.send("index");
    });
    // Serve the application at the given port
    app.listen(port, function () {
        // Success callback
        console.log("Listening at http://localhost:" + port + "/");
    });
}
main();
