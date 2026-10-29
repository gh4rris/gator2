import { type Feed, feeds } from "../schema";
import { db } from "..";

import { eq, sql } from "drizzle-orm";


export async function createFeed(name: string, url: string, userId: string): Promise<Feed> {
    const [result] = await db.insert(feeds).values({ name: name, url: url, userId: userId }).returning();
    return result;
}

export async function getFeeds(): Promise<Feed[]> {
    return await db.select().from(feeds);
}

export async function getFeedByURL(url: string): Promise<Feed> {
    const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
    return result;
}

export async function markFeedFetched(feedId: string): Promise<Feed> {
    const [result] = await db.update(feeds).set({
        lastFetchedAt: new Date()
    }).where(eq(feeds.id, feedId)).returning();
    return result;
}

export async function getNextFeedToFetch(): Promise<Feed> {
    const [result] = await db.select().from(feeds).orderBy(sql`${feeds.lastFetchedAt} nulls first`);
    return result;
}
