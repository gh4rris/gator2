import { type CommandHandler, UserCommandHandler } from "./commands/commands";
import { readConfig } from "./config";
import { getUser } from "./lib/db/queries/users";


export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (cmd: string, ...args: string[]): Promise<void> => {
        const config = readConfig()
        const user = await getUser(config.currentUserName);
        if (!user) {
            throw new Error(`User ${config.currentUserName} not found`);
        }
        await handler(cmd, user, ...args);
    }
}
