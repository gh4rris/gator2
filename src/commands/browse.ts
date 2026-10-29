import { type User } from "../lib/db/schema";
import { getPostsForUser } from "../lib/db/queries/posts";


export async function handlerBrowse(cmdName: string, user: User, ...args: string[]): Promise<void> {
    let limit = 2;
    if (args.length > 0) {
        const specifiedLimit = parseInt(args[0]);
        if (specifiedLimit) {
            limit = specifiedLimit;
        } else {
            throw new Error(`usage: ${cmdName} [limit]`);
        }
    }
    const posts = await getPostsForUser(user.id, limit);
    for (const post of posts) {
        console.log(`Title: ${post.title}`);
        console.log(`URL: ${post.url}`);
        console.log(`Description: ${post.description}`);
        console.log(`Published: ${post.publishedAt}`);
        console.log();
    }
}
