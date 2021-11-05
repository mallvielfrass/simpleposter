export interface UserRegister {
    name: string;
    date: number;//unix timestamp
    hash: string;
}
export interface UserSession extends UserRegister {
    uuid: string;
    expiredDate: number;
}
//const currentTimeInMilliseconds = Date.now();
//console.log(currentTimeInMilliseconds);
export interface Post {
    name: string;
    post: string;
    date: number;
}