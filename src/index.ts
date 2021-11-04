import express from 'express'

import { cryptographic } from './modules/crypto';
import { DB } from "./modules/sqlite"
import { user } from './modules/user';
var bodyParser = require('body-parser')

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
apiRouter.use("/createpost", function (request, response) {
    response.json({ "method": "api" });
});
apiRouter.use("/deletepost", function (request, response) {
    response.json({ "method": "api" });
});
apiRouter.use("/createuser", async function (request, response) {
    //   console.log("req: ", request)
    console.log("body: ", request.body)
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
    console.log(`name= ${name} | passw = ${password}`)
    if (name == "" || password == "") {
        response.json({ "status": "bad", "error": "login or password  empty" });
        return
    }
    let check: boolean = await DB.checkRegister(name)
    console.log(`>check:[${check}]`)
    if (check) {
        response.json({ "status": "bad", "error": "user already created" });
        return
    }

    let hash: string = await cryptographic.hashPassword(password);
    console.log(`> hash:[${hash}]`)
    let userData = await user.register(name, hash)
    console.log(`>userData:[${userData}]`)
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
