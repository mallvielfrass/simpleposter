import express from 'express'
import { welcome, jsonType } from "./func"

function main() {
    // Create a new express application instance
    const app: express.Application = express();
    // The port the express app will listen on
    const port: number = 3001;


    app.use('/hi', (w, r) => {
        r.send("hi");
    });
    app.use('/w', (w, r) => { welcome(w, r) });
    app.use('/jt', (w, r) => { jsonType(w, r) });
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
