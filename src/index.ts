import { type CommandsRegistry, registerCommand, runCommand } from "./commands/commands";
import { middlewareLoggedIn } from "./middleware";
import { handlerLogin, handlerRegister, handlerListUsers } from "./commands/users";
import { handlerReset } from "./commands/reset";
import { handlerAggregate } from "./commands/aggregate";
import { handlerBrowse } from "./commands/browse";
import { handlerAddFeed, handlerListFeeds } from "./commands/feeds";
import { handlerFollow, handlerListFollowing, handlerUnfollow } from "./commands/follows";

import process from "process";


async function main() {
    const args = process.argv.slice(2)
    
    if (args.length === 0) {
        console.log("No arguments provided");
        process.exit(1);
    }

    const cmdName = args[0];
    const cmdArgs = args.slice(1);
    const registry: CommandsRegistry = {}
    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", handlerRegister);
    registerCommand(registry, "reset", handlerReset);
    registerCommand(registry, "users", handlerListUsers);
    registerCommand(registry, "agg", handlerAggregate);
    registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeed));
    registerCommand(registry, "feeds", handlerListFeeds);
    registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow));
    registerCommand(registry, "following", middlewareLoggedIn(handlerListFollowing));
    registerCommand(registry, "unfollow", middlewareLoggedIn(handlerUnfollow));
    registerCommand(registry, "browse", middlewareLoggedIn(handlerBrowse));

    try {
        await runCommand(registry, cmdName, ...cmdArgs);
    } catch (err) {
        if (err instanceof Error) {
            console.error(`Error running command: ${cmdName}: ${err.message}`);
        } else {
            console.error(`Error running command: ${cmdName}: ${err}`);
        }
        process.exit(1)
    }
    process.exit(0)
}

main();
