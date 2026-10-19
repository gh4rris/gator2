import { type CommandsRegistry, registerCommand, runCommand } from "./commands/commands";
import { handlerLogin, handlerRegister } from "./commands/users";
import { handlerReset } from "./commands/reset";

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
    registerCommand(registry, "login", handlerLogin)
    registerCommand(registry, "register", handlerRegister)
    registerCommand(registry, "reset", handlerReset)

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
