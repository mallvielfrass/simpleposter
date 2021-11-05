import express from 'express'

import { cryptographic } from './modules/crypto';
import { DB } from "./modules/sqlite"
import { user } from './modules/user';
import { Post } from './modules/types';
const cors = require('cors');
var bodyParser = require('body-parser')
const getAppCookies = (req) => {
    // We extract the raw cookies from the request headers
    const rawCookies = req.headers.cookie.split('; ');
    // rawCookies = ['myapp=secretcookie, 'analytics_cookie=beacon;']

    const parsedCookies = {};
    rawCookies.forEach(rawCookie => {
        const parsedCookie = rawCookie.split('=');
        // parsedCookie = ['myapp', 'secretcookie'], ['analytics_cookie', 'beacon']
        parsedCookies[parsedCookie[0]] = parsedCookie[1];
    });
    return parsedCookies;
};
async function loggerMiddleware(request: express.Request, response: express.Response, next) {
    var middlewareAuth: Array<string> = ['/api/createpost', '/api/middleware'];
    console.log(`middleware> ${request.method} ${request.path}`);
    if (!(middlewareAuth.indexOf(request.path) > -1)) return next();
    if (request.headers.cookie == undefined) {
        response.json({ "status": "bad", "error": "cookies empty" });
    }
    if (request.headers.cookie.length == 0) {
        response.json({ "status": "bad", "error": "cookies empty" });
    }

    let cookieArray = getAppCookies(request);

    if ((cookieArray["name"] == undefined) || (cookieArray["uuid"] == undefined) || (cookieArray["expired"] == undefined)) {

        response.json({ "status": "bad", "error": "cookies empty" });
        return
    }
    let name: string = cookieArray["name"];
    let uuid: string = cookieArray["uuid"];
    let expired: number = Number(cookieArray["expired"]);
    if (isNaN(expired)) {
        //  console.log('Not a Number');
        response.json({ "status": "bad", "error": "cookie parsing broken" });
        return
    }
    if (expired < Date.now()) {
        response.json({ "status": "bad", "error": "token date expired" });
        return
    }
    let res: boolean = await DB.checkSession(name, uuid);
    // console.log(`resDB.checkSession: ${res}`)
    if (!res) {
        response.json({ "status": "bad", "error": "session not valid" });
        return
    }
    next();
}
// Create a new express application instance
const app: express.Application = express();
var router = express.Router();
// The port the express app will listen on
const port: number = 3001;
DB.migrate();

//api
// определяем Router
const apiRouter = express.Router();
app.use(bodyParser.json())
app.use(cors())
app.use(loggerMiddleware)
apiRouter.use("/createpost", async function (request, response) {
    let name: string = getAppCookies(request)["name"];
    if (request.body.post == undefined) {
        response.json({ "status": "bad", "error": "post empty" });
        return
    }
    let post: string = request.body.post;
    if (post.length == 0) {
        response.json({ "status": "bad", "error": "post empty" });
        return
    }
    let postStrict: Post = {
        name: name,
        post: post,
        date: Date.now()
    }
    let res: boolean = await DB.addPost(postStrict);
    //console.log(`insert: ${res}`)
    if (!res) {
        response.json({ "status": "bad", "error": "error insert post to database" });
        return
    }
    response.json({ "status": "ok" });
});
apiRouter.use("/deletepost", function (request, response) {
    response.json({ "method": "api" });
});
apiRouter.use("/middleware", function (request, response) {
    response.json({ "status": "ok" });
});
apiRouter.use("/createuser", async function (request, response) {
    //   console.log("req: ", request)
    // console.log("body: ", request.body)
    let name: string = "";
    let password: string = "";
    try {
        if (request.body.name !== undefined && request.body.password != undefined) {
            name = request.body.name;
            password = request.body.password;
        } else {
            response.json({ "status": "bad", "error": "login or password empty" });
            return
        }

    }
    catch (err) {
        response.json({ "status": "bad", "error": "login or password not found" });
        return
    }
    // console.log(`name= ${name} | passw = ${password}`)
    if (name == "" || password == "") {
        response.json({ "status": "bad", "error": "login or password  empty" });
        return
    }
    let check: boolean = await DB.checkRegister(name)
    // console.log(`>check:[${check}]`)
    if (check) {
        response.json({ "status": "bad", "error": "user already created" });
        return
    }

    let hash: string = await cryptographic.hashPassword(password);
    //    console.log(`> hash:[${hash}]`)
    let userData = await user.register(name, hash)
    //  console.log(`>userData:[${userData}]`)
    response.json({
        "status": "ok", "user": {
            "name": userData.name,
            "expired": userData.expiredDate,
            "uuid": userData.uuid

        }
    });
});
apiRouter.use("/", function (request, response) {
    response.json({ "method": "api" });
});
// __/api
app.use("/api", apiRouter);

app.use('/', (w, r) => {
    r.send("index");
});

// Serve the application at the given port
app.listen(port, () => {
    // Success callback
    console.log(`Listening at http://localhost:${port}/`);
});

export default app;
