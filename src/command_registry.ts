import { type CommandHandler } from "./command_handler"

export type CommandsRegistry = Record<string, CommandHandler>


export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler): void {
    registry[cmdName] = handler;
}


export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): void {
    const command = registry[cmdName];
    if (command) {
        command(cmdName, ...args);
    }
}
