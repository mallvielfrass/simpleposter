//import { DB } from "./sqlite"
import bcrypt from 'bcrypt';
var crypto = require("crypto");
const salt = "1234"
const saltRounds = 5;
export class cryptographic {

    static async hashPassword(password: string): Promise<string> {
        let hash: string = await bcrypt.hash(password, saltRounds);

        return hash
    }
    static async comparePasswordAndHash(password: string, hash: string): Promise<boolean> {
        let newHash = await cryptographic.hashPassword(password)
        return (newHash == hash)
    }
    static generateSessionUUID(): string {
        let uuid: string = crypto.randomBytes(20).toString('hex');
        return uuid
    }
}