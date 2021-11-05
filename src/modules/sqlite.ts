var sqlite3 = require("sqlite3").verbose();
import { Post } from '../modules/types';
var db = new sqlite3.Database(checkDB());
function checkDB(): string {//

    if (process.env.NODE_ENV == "test") {
        console.log(`>database in test mode`)
        return ":memory:"
    }
    console.log(`>database in production mode`)
    return "database.db"
}
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
            if (err) {
                console.log(`error db_insert: ${err}`)
                return reject(err);
            }
            //console.log(res)
            resolve(res);
            return true;
        });

    });
}

export class DB {
    static migrate() {
        db.serialize(function () {
            db.run("CREATE TABLE IF NOT EXISTS test(info TEXT)");
            db.run(`CREATE TABLE IF NOT EXISTS createdUser(name TEXT, date INT,hash TEXT)`, function (err, res) {
                if (err) { console.log("migrate err:", err); }
            });
            db.run(`CREATE TABLE IF NOT EXISTS posts(name TEXT,post TEXT, date INT)`, function (err, res) {
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
    static async checkSession(name: string, uuid: string): Promise<boolean> {
        let res = await db_all(`SELECT * FROM userSessions WHERE name = '${name}' and uuid='${uuid}'`)
        // console.log(`>check checkSession:[${JSON.stringify(res)}]  [${res.length}] `)
        if (res.length == 0) {
            return false
        }
        let expDate: number = Number(res[res.length - 1]["expiredDate"])
        if (isNaN(expDate)) {
            return false;
        }
        if (expDate < Date.now()) {
            return false;
        }
        return true;
    }
    static async getInfo(info: string): Promise<string[]> {
        let rows = await db_all(`SELECT * FROM test`);
        return rows;
    }
    static async checkRegister(name: string): Promise<boolean> {
        let rows = await db_all(`SELECT * FROM createdUser WHERE name = '${name}'`);
        // console.log(`>check createdUser:[${JSON.stringify(rows)}]  [${rows.length}] `)

        return (0 != rows.length);
    }
    static async addPost(postStrict: Post): Promise<boolean> {
        let res: boolean = await db_insert(`INSERT INTO posts(name, post, date) VALUES('${postStrict.name}','${postStrict.post}','${postStrict.date}')`)
        //let rows = await db_all(`SELECT * FROM createdUser WHERE name = '${name}'`);
        // console.log(`>check createdUser:[${JSON.stringify(rows)}]  [${rows.length}] `)

        return true;
    }
    static async addUserRegister(struct: UserRegister) {
        db_insert(`INSERT INTO createdUser(name,date,hash) VALUES('${struct.name}','${struct.date}','${struct.hash}')`)
    }
    static async addUserSession(struct: UserSession) {
        db_insert(`INSERT INTO userSessions(name, date, hash, uuid, expiredDate) VALUES('${struct.name}','${struct.date}','${struct.hash}','${struct.uuid}','${struct.expiredDate}')`)
    }
}
