import app from "./app";
import {AppDataSource} from "./db/db";
import {PORT} from "./config/config";


async function main() {
    try {
        await AppDataSource.initialize();
        app.listen(PORT);
        console.log(`Listening on port ${PORT}`);
    } catch (e) {
        console.error(e);
    }
}

main();