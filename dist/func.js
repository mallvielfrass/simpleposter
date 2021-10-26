"use strict";
exports.__esModule = true;
exports.jsonType = exports.welcome = void 0;
function welcome(req, w) {
    w.send("welcome");
}
exports.welcome = welcome;
function jsonType(req, w) {
    var item = {
        name: "test",
        price: 234
    };
    w.json(item);
}
exports.jsonType = jsonType;
exports["default"] = welcome;
