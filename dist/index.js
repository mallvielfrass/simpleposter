"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var crypto_1 = require("./modules/crypto");
var sqlite_1 = require("./modules/sqlite");
var user_1 = require("./modules/user");
var bodyParser = require('body-parser');
// Create a new express application instance
var app = (0, express_1["default"])();
var router = express_1["default"].Router();
// The port the express app will listen on
var port = 3001;
sqlite_1.DB.migrate();
//api
// определяем Router
var apiRouter = express_1["default"].Router();
app.use(bodyParser.json());
apiRouter.use("/createpost", function (request, response) {
    response.json({ "method": "api" });
});
apiRouter.use("/deletepost", function (request, response) {
    response.json({ "method": "api" });
});
apiRouter.use("/createuser", function (request, response) {
    return __awaiter(this, void 0, void 0, function () {
        var name, password, check, hash, userData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    //   console.log("req: ", request)
                    console.log("body: ", request.body);
                    name = "";
                    password = "";
                    try {
                        if (request.body.name !== undefined && request.body.password != undefined) {
                            name = request.body.name;
                            password = request.body.password;
                        }
                        else {
                            response.json({ "status": "bad", "error": "login or password empty" });
                            return [2 /*return*/];
                        }
                    }
                    catch (err) {
                        response.json({ "status": "bad", "error": "login or password not found" });
                        return [2 /*return*/];
                    }
                    console.log("name= " + name + " | passw = " + password);
                    if (name == "" || password == "") {
                        response.json({ "status": "bad", "error": "login or password  empty" });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, sqlite_1.DB.checkRegister(name)];
                case 1:
                    check = _a.sent();
                    console.log(">check:[" + check + "]");
                    if (check) {
                        response.json({ "status": "bad", "error": "user already created" });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, crypto_1.cryptographic.hashPassword(password)];
                case 2:
                    hash = _a.sent();
                    console.log("> hash:[" + hash + "]");
                    return [4 /*yield*/, user_1.user.register(name, hash)];
                case 3:
                    userData = _a.sent();
                    console.log(">userData:[" + userData + "]");
                    response.json({
                        "status": "ok", "user": {
                            "name": userData.name,
                            "expired": userData.expiredDate,
                            "uuid": userData.uuid
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
});
apiRouter.use("/", function (request, response) {
    response.json({ "method": "api" });
});
// __/api
app.use("/api", apiRouter);
app.use('/', function (w, r) {
    r.send("index");
});
// Serve the application at the given port
app.listen(port, function () {
    // Success callback
    console.log("Listening at http://localhost:" + port + "/");
});
module.exports = app;
