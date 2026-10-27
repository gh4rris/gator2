import { db } from "..";
import { users } from "../schema";
import { type User } from "../schema";

import { eq } from "drizzle-orm";


export async function createUser(name: string): Promise<User> {
    const [result] = await db.insert(users).values({ name: name }).returning();
    return result;
}

export async function getUser(name: string): Promise<User> {
    const [result] = await db.select().from(users).where(eq(users.name, name));
    return result;
}

export async function getUserById(id: string): Promise<User> {
    const [result] = await db.select().from(users).where(eq(users.id, id));
    return result;
}

export async function clearUsers(): Promise<void> {
    await db.delete(users);
}

export async function getUsers(): Promise<User[]> {
    return await db.select().from(users);
}
