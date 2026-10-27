import { readConfig } from "../config";
import { getUser } from "../lib/db/queries/users";
import { getFeedByURL } from "../lib/db/queries/feeds";
import { createFeedFollow, getFeedFollowsForUser } from "../lib/db/queries/follows";


export async function handlerFollow(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length == 0) {
        throw new Error(`${cmdName} requires url`);
    }
    const config = readConfig()
    const user = await getUser(config.currentUserName);
    if (!user) {
        throw new Error(`User ${config.currentUserName} not found`);
    }

    const url = args[0]
    const feed = await getFeedByURL(url);
    if (!feed) {
        throw new Error(`Feed not found: ${url}`);
    }

    const result = await createFeedFollow(user.id, feed.id);
    console.log(`ID: ${result.id}`);
    console.log(`Created: ${result.createdAt}`);
    console.log(`Updated: ${result.updatedAt}`);
    console.log(`Feed Name: ${result.feedName}`);
    console.log(`User Name: ${result.userName}`);
}

export async function handlerListFollowing() {
    const config = readConfig()
    const user = await getUser(config.currentUserName);
    if (!user) {
        throw new Error(`User ${config.currentUserName} not found`);
    }

    const follows = await getFeedFollowsForUser(user.id);
    if (follows.length ==0) {
        console.log("No feed follows found for this user");
        return;
    }

    console.log("Following:")
    for (const follow of follows) {
        console.log(`* ${follow.feedName}`);
    }
}
