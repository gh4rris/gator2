import { clearUsers } from "../lib/db/queries/users";


export async function handlerReset(): Promise<void> {
    await clearUsers();
    console.log("Database reset")
}
