import { UserRegister, UserSession } from './types'
import { DB } from "./sqlite"
import { cryptographic } from './crypto'
export class user {

    static async register(name: string, hash: string): Promise<UserSession> {
        let user: UserRegister = {
            name: name,
            hash: hash,
            date: Date.now()
        }
        DB.addUserRegister(user)
        let userS: UserSession = {
            name: name,
            hash: hash,
            date: Date.now(),
            uuid: cryptographic.generateSessionUUID(),
            expiredDate: Date.now() + 2629743
        }
        DB.addUserSession(userS)
        return userS;
    }
    static async auth(name: string, hash: string) {
        // let user: UserSession = {
        //     name: name,
        //     hash: hash
        // }
    }
}