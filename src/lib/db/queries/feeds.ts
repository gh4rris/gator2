import { db } from "..";
import { feeds } from "../schema";
import { type Feed } from "../schema";

import { eq } from "drizzle-orm";


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
