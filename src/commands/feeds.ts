import { createFeed } from "../lib/db/queries/feeds";
import { getUser } from "../lib/db/queries/users";
import type { User, Feed } from "../lib/db/schema";

import { readConfig } from "../config";


export async function handlerAddFeed(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length < 2) {
        throw new Error(`${cmdName} requires name and url`)
    }
    const config = readConfig();
    const user = await getUser(config.currentUserName);
    if (!user) {
        throw new Error(`User ${config.currentUserName} not found`);
    }

    const name = args[0];
    const url = args[1];
    const feed = await createFeed(name, url, user.id);
    printFeed(user, feed);
}

function printFeed(user: User, feed: Feed) {
    console.log(`User:\n${user.id}\n${user.createdAt}\n${user.updatedAt}\n${user.name}`)
    console.log(`\nFeed:\n${feed.id}\n${feed.createdAt}\n${feed.updatedAt}\n${feed.name}\n${feed.url}\n${feed.userId}`)
}
