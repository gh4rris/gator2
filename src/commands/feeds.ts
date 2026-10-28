import { createFeed } from "../lib/db/queries/feeds";
import { getUserById } from "../lib/db/queries/users";
import { getFeeds } from "../lib/db/queries/feeds";
import { createFeedFollow } from "../lib/db/queries/follows";
import type { User, Feed } from "../lib/db/schema";


export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]): Promise<void> {
    if (args.length < 2) {
        throw new Error(`${cmdName} requires name and url`);
    }

    const name = args[0];
    const url = args[1];
    const feed = await createFeed(name, url, user.id);

    await createFeedFollow(user.id, feed.id);
    printFeed(user, feed);
}

function printFeed(user: User, feed: Feed) {
    console.log(`ID: ${feed.id}`);
    console.log(`Created: ${feed.createdAt}`);
    console.log(`Updated: ${feed.updatedAt}`);
    console.log(`Name: ${feed.name}`);
    console.log(`URL: ${feed.url}`);
    console.log(`User: ${user.name}`);
    console.log();
}


export async function handlerListFeeds(): Promise<void> {
    const feeds = await getFeeds();
    if (!feeds) {
        console.log("No feeds to list");
    }
    for (const feed of feeds) {
        const user = await getUserById(feed.userId);
        if (!user) {
            throw new Error(`Failed to find user for feed ${feed.id}`);
        }
        printFeed(user, feed);
    }
}
