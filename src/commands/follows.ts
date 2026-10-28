import { getFeedByURL } from "../lib/db/queries/feeds";
import { createFeedFollow, getFeedFollowsForUser } from "../lib/db/queries/follows";
import { type User } from "../lib/db/schema";


export async function handlerFollow(cmdName: string, user: User, ...args: string[]): Promise<void> {
    if (args.length == 0) {
        throw new Error(`${cmdName} requires url`);
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

export async function handlerListFollowing(_cmd: string, user: User, ..._args: string[]) {
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
