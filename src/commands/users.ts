import { setUser } from "../config";


export function handlerLogin(cmdName: string, ...args: string[]): void {
    if (args.length === 0) {
        throw new Error(`${cmdName} requires username`)
    }
    const userName = args[0];
    setUser(userName);
    console.log(`User has been set to ${userName}`);
}

