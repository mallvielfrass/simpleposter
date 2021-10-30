"use strict";
// /**
//  * SQLite module.
//  * @module sqlite3
//  */
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
exports.__esModule = true;
exports.DB = void 0;
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("database.db");
function db_all(query) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    db.all(query, function (err, rows) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(rows);
                    });
                })];
        });
    });
}
function db_get(query) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    db.all(query, function (err, row) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(row);
                    });
                })];
        });
    });
}
function db_insert(query) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    db.run(query, function (err, res) {
                        if (err) {
                            return reject(err);
                        }
                        // console.log("res:", res)
                        resolve(res);
                        return true;
                        //  console.log("res:", res)
                    });
                })];
        });
    });
}
// export interface UserRegister {
//     name: string;
//     date: number;
//     //const currentTimeInMilliseconds = Date.now();
//     //console.log(currentTimeInMilliseconds);
// }
var DB = /** @class */ (function () {
    function DB() {
    }
    DB.migrate = function () {
        db.serialize(function () {
            db.run("CREATE TABLE IF NOT EXISTS test(info TEXT)");
            db.run("CREATE TABLE IF NOT EXISTS createdUser(name TEXT, date INT,hash TEXT)", function (err, res) {
                if (err) {
                    console.log("migrate err:", err);
                }
            });
            db.run("CREATE TABLE IF NOT EXISTS userSessions(name TEXT, date INT,hash TEXT, uuid TEXT,expiredDate INT)", function (err, res) {
                if (err) {
                    console.log("migrate err:", err);
                }
            });
            console.log(">migrate BD");
        });
    };
    DB.addInfo = function (info) {
        db.run("INSERT INTO test VALUES ($task)", {
            $task: info
        });
    };
    DB.getInfo = function (info) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_all("SELECT * FROM test")];
                    case 1:
                        rows = _a.sent();
                        // let fruits: string[] = ['Apple', 'Orange', 'Banana'];
                        // console.log("row:", rows)
                        //console.log("q:", q)
                        return [2 /*return*/, rows];
                }
            });
        });
    };
    DB.checkRegister = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_all("SELECT * FROM createdUser WHERE name = '" + name + "'")];
                    case 1:
                        rows = _a.sent();
                        // let fruits: string[] = ['Apple', 'Orange', 'Banana'];
                        console.log(">createdUser:", rows);
                        //console.log("q:", q)
                        if (0 < rows.length) {
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    DB.addUserRegister = function (struct) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                db_insert("INSERT INTO createdUser(name,date,hash) VALUES('" + struct.name + "','" + struct.date + "','" + struct.hash + "')");
                return [2 /*return*/];
            });
        });
    };
    DB.addUserSession = function (struct) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                db_insert("INSERT INTO userSessions(name, date, hash, uuid, expiredDate) VALUES('" + struct.name + "','" + struct.date + "','" + struct.hash + "','" + struct.uuid + "','" + struct.expiredDate + "')");
                return [2 /*return*/];
            });
        });
    };
    return DB;
}());
exports.DB = DB;
// module.exports = {
//     migrate: function (callback: any) {
//         // db.all("SELECT * FROM todo", function (err: any, res: any) {
//         //     callback(res);
//         // });
//         console.log("kek")
//     },
//     getTodoList: function (callback: any) {
//         db.all("SELECT * FROM todo", function (err: any, res: any) {
//             callback(res);
//         });
//     },
//     getDoneList: function (callback: any) {
//         db.all("SELECT * FROM done", function (err: any, res: any) {
//             callback(res);
//         });
//     },
//     addTask: function (taskName: string, callback: any) {
//         db.run("INSERT INTO todo VALUES ($task)", {
//             $task: taskName
//         }, function () {
//             callback();
//         });
//     },
//     completeTask: function (taskName: string, callback: any) {
//         // Delete the task from the todo list.
//         db.run("DELETE FROM todo WHERE task=$task", {
//             $task: taskName
//         }, function () {
//             db.run("INSERT INTO done VALUES ($task)", {
//                 $task: taskName
//             }, function () {
//                 callback();
//             });
//         });
//     },
//     clearComplete: function (callback: any) {
//         // Delete all cleared tasks.
//         db.run("DELETE FROM done", function () {
//             callback();
//         });
//     }
// }
// // Importing SQLite3 to our project.
// var sqlite3 = require("sqlite3").verbose();
// // Setting up a database for storing data.
// let db = new sqlite3.Database('./database.db', (err) => {
//     if (err) {
//         console.error(err.message);
//     }
//     console.log('Connected to the chinook database.');
// });
// export class DB {
//     const DB() { }
//      function migrate() {
//     db.serialize(function () {
//         db.run("CREATE TABLE IF NOT EXISTS  $table(info TEXT)", {
//             $table: "test"
//         });
//         console.log(">migrate BD");
//     })
// },
// }
// module.exports = {
//     migrate: function () {
//         db.serialize(function () {
//             db.run("CREATE TABLE IF NOT EXISTS  $table(info TEXT)", {
//                 $table: "test"
//             });
//             console.log(">migrate BD");
//         })
//     },
//     // getTodoList: function (): string {
//     //     let res = db.all("SELECT * FROM todo", function (err: any, res: any): any {
//     //         return res;
//     //     });
//     //     return "l";
//     // },
//     addInfo: function (info: string) {
//         db.run("INSERT INTO $table VALUES ($task)", {
//             $table: "test",
//             $task: info
//         });
//     },
//     // addTask: function (taskName: string) {
//     //     // Add a task to the todo list.
//     //     db.run("INSERT INTO todo VALUES ($task)", {
//     //         $task: taskName
//     //     });
//     // },
//     // All of our functions go here.
// };
// /**
//  * SQLite module.
//  * @module sqlite3
//  */
// var sqlite3 = require("sqlite3").verbose();
// var db = new sqlite3.Database("database.db");
// module.exports = {
//     getTodoList: function (callback: any) {
//         db.all("SELECT * FROM todo", function (err: any, res: any) {
//             callback(res);
//         });
//     },
//     getDoneList: function (callback: any) {
//         db.all("SELECT * FROM done", function (err: any, res: any) {
//             callback(res);
//         });
//     },
//     addTask: function (taskName: string, callback: any) {
//         db.run("INSERT INTO todo VALUES ($task)", {
//             $task: taskName
//         }, function () {
//             callback();
//         });
//     },
//     completeTask: function (taskName: string, callback: any) {
//         // Delete the task from the todo list.
//         db.run("DELETE FROM todo WHERE task=$task", {
//             $task: taskName
//         }, function () {
//             db.run("INSERT INTO done VALUES ($task)", {
//                 $task: taskName
//             }, function () {
//                 callback();
//             });
//         });
//     },
//     clearComplete: function (callback: any) {
//         // Delete all cleared tasks.
//         db.run("DELETE FROM done", function () {
//             callback();
//         });
//     }
// }
