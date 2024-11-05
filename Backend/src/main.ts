import { db } from "./middleware/database.js";

async function main() {
    console.log("hello world");
    const users = await db.selectFrom('_user').selectAll().execute();
    console.log(users);
}

main();