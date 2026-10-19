import { setUser, readConfig } from "../config";
import { createUser, getUser, getUsers } from "../lib/db/queries/users";


export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length === 0) {
        throw new Error(`${cmdName} requires username`)
   }
    const userName = args[0];
    const existingUser = await getUser(userName);
    if (!existingUser) {
        throw new Error(`User ${userName} not found`)
    }

    setUser(userName);
    console.log(`User has been set to ${userName}`);
}

export async function handlerRegister(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length === 0) {
        throw new Error(`${cmdName} requires username`);
    }

    const userName = args[0];
    const existingUser = await getUser(userName);
    if (existingUser) {
        throw new Error(`User ${userName} already exists`)
    }
    const user =  await createUser(userName);
    if (!user) {
        throw new Error(`User ${userName} not found`);
    }

    setUser(user.name);
    console.log(`User created:\nid: ${user.id}\nname: ${user.name}\ncreated_at: ${user.createdAt}\nupdated_at: ${user.updatedAt}`);
    
}

export async function handlerUsers(): Promise<void> {
    const users = await getUsers();
    const config = readConfig();
    const currentUser = config.currentUserName;

    console.log("Users:")
    for (const user of users) {
        if (user.name === currentUser) {
            console.log(`* ${user.name} (current)`)
            continue
        }
        console.log(`* ${user.name}`)
    }
}
