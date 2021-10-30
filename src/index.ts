import express from 'express'

import { cryptographic } from './modules/crypto';
import { DB } from "./modules/sqlite"
import { user } from './modules/user';
var task: string[], complete: string[];
task = [];
complete = [];
function main() {
    // Create a new express application instance
    const app: express.Application = express();
    var router = express.Router();
    // The port the express app will listen on
    const port: number = 3001;
    DB.migrate();
    // DB.register("kek");
    //api
    // определяем Router
    const apiRouter = express.Router();

    // apiRouter.use("/d:id", function (request, response) {
    //     response.send(` ${request.params.id}`);
    // });
    apiRouter.use("/createpost", function (request, response) {
        response.json({ "method": "api" });
    });
    apiRouter.use("/deletepost", function (request, response) {
        response.json({ "method": "api" });
    });
    apiRouter.use("/createuser", async function (request, response) {
        let name: string = request.body.name;
        if (DB.checkRegister(name)) {
            response.json({ "status": "bad", "error": "user already created" });
        }
        let password: string = request.body.password;
        let hash: string = await cryptographic.hashPassword(password);
        let userData = user.register(name, hash)

        response.json({ "status": "ok", "user": userData });
    });
    apiRouter.use("/", function (request, response) {
        response.json({ "method": "api" });
    });
    // сопотавляем роутер с конечной точкой "/api"
    app.use("/api", apiRouter);

    app.use('/', (w, r) => {
        r.send("index");
    });

    // Serve the application at the given port
    app.listen(port, () => {
        // Success callback
        console.log(`Listening at http://localhost:${port}/`);
    });
}
main()
