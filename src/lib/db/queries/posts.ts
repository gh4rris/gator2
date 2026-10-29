import { type Post, posts, feedFollows } from "../schema";
import { db } from "..";
import { eq, desc } from "drizzle-orm";


export async function createPost(feedId: string, title: string, url: string, description: string, publishedAt: Date): Promise<Post> {
    const [result] = await db.insert(posts).values({
        title: title,
        url: url,
        description: description,
        publishedAt: publishedAt,
        feedId: feedId
    }).onConflictDoNothing().returning();
    return result;
}

export async function getPostsForUser(userId: string, limit: number): Promise<Post[]> {
    return await db.select({
        id: posts.id,
        createdAt: posts.createdAt,
        updatedAt: posts.createdAt,
        title: posts.title,
        url: posts.url,
        description: posts.description,
        publishedAt: posts.publishedAt,
        feedId: posts.feedId
    }).from(posts)
        .innerJoin(feedFollows, eq(posts.feedId, feedFollows.feedId))
        .where(eq(feedFollows.userId, userId)).orderBy(desc(posts.publishedAt)).limit(limit);
}
