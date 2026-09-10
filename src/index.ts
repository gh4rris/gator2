import { type CommandsRegistry, registerCommand, runCommand } from "./command_registry";
import { handlerLogin } from "./command_handler";
import process from "process";

function main() {
    const registry: CommandsRegistry = {}
    registerCommand(registry, "login", handlerLogin)
    const cargs = process.argv.slice(2)
    if (cargs.length === 0) {
        console.log("No arguments provided");
        process.exit(1)
    }

    const cmdName = cargs[0];
    const args = cargs.slice(1);

    runCommand(registry, cmdName, ...args);
    
}

main();
