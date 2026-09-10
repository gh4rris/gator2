import { setUser } from "./config";

export type CommandHandler = (cmd: string, ...args: string[]) => void;


export function handlerLogin(cmdName: string, ...args: string[]): void {
    if (args.length === 0) {
        throw new Error("Login requires username")
    }
    const userName = args[0];
    setUser(userName);
    console.log(`User has been set to ${userName}`);
}
