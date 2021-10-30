// /**
//  * SQLite module.
//  * @module sqlite3
//  */

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("database.db");
import { UserRegister, UserSession } from './types'
async function db_all(query: string): Promise<string[]> {
    return new Promise(function (resolve, reject) {
        db.all(query, function (err, rows) {
            if (err) { return reject(err); }
            resolve(rows);
        });
    });
}
async function db_get(query: string): Promise<string> {
    return new Promise(function (resolve, reject) {
        db.all(query, function (err, row) {
            if (err) { return reject(err); }
            resolve(row);
        });
    });
}
async function db_insert(query: string): Promise<boolean> {
    return new Promise(function (resolve, reject) {
        db.run(query, function (err, res) {
            if (err) { return reject(err); }
            // console.log("res:", res)
            resolve(res);
            return true;
            //  console.log("res:", res)
        });
    });
}
// export interface UserRegister {
//     name: string;
//     date: number;
//     //const currentTimeInMilliseconds = Date.now();
//     //console.log(currentTimeInMilliseconds);
// }

export class DB {
    static migrate() {
        db.serialize(function () {

            db.run("CREATE TABLE IF NOT EXISTS test(info TEXT)");
            db.run(`CREATE TABLE IF NOT EXISTS createdUser(name TEXT, date INT,hash TEXT)`, function (err, res) {
                if (err) { console.log("migrate err:", err); }
            });
            db.run(`CREATE TABLE IF NOT EXISTS userSessions(name TEXT, date INT,hash TEXT, uuid TEXT,expiredDate INT)`, function (err, res) {
                if (err) { console.log("migrate err:", err); }
            });
            console.log(">migrate BD");
        })
    }
    static addInfo(info: string): any {
        db.run("INSERT INTO test VALUES ($task)", {
            $task: info
        });
    }
    static async getInfo(info: string): Promise<string[]> {

        let rows = await db_all(`SELECT * FROM test`);
        // let fruits: string[] = ['Apple', 'Orange', 'Banana'];
        // console.log("row:", rows)
        //console.log("q:", q)
        return rows;
    }
    static async checkRegister(name: string): Promise<boolean> {

        let rows = await db_all(`SELECT * FROM createdUser WHERE name = '${name}'`);
        // let fruits: string[] = ['Apple', 'Orange', 'Banana'];
        console.log(">createdUser:", rows)
        //console.log("q:", q)
        if (0 < rows.length) {
            return true;
        }
        return false;
    }
    static async addUserRegister(struct: UserRegister) {
        db_insert(`INSERT INTO createdUser(name,date,hash) VALUES('${struct.name}','${struct.date}','${struct.hash}')`)
        //db_insert(`INSERT INTO createdUser(name) VALUES('${name}')`);
    }
    static async addUserSession(struct: UserSession) {
        db_insert(`INSERT INTO userSessions(name, date, hash, uuid, expiredDate) VALUES('${struct.name}','${struct.date}','${struct.hash}','${struct.uuid}','${struct.expiredDate}')`)
        //db_insert(`INSERT INTO createdUser(name) VALUES('${name}')`);
    }
}

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


