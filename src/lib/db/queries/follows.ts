import { type FeedFollow } from "../schema";
import { db } from "..";
import { feedFollows, feeds, users } from "../schema";

import { and, eq } from "drizzle-orm";


export async function createFeedFollow(userId: string, feedId: string) {
    const [newFeedFollow] = await db.insert(feedFollows).values({ userId: userId, feedId: feedId }).returning();
    const [result] = await db.select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        feedName: feeds.name,
        userName: users.name
    }).from(feedFollows)
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .where(and(eq(feedFollows.id, newFeedFollow.id), eq(feedFollows.userId, userId)));
    return result;
}

export async function getFeedFollowsForUser(userId: string) {
    return await db.select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        feedName: feeds.name
    }).from(feedFollows).where(eq(feedFollows.userId, userId))
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id));
}

export async function deleteFeedFollow(userId: string, feedId: string): Promise<FeedFollow> {
    const [result] = await db.delete(feedFollows).where(
        and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feedId))
    ).returning();
    return result;
}

