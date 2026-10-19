import { readConfig } from "../../config";
import * as schema from "./schema"

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";


const config = readConfig();
const conn = postgres(config.dbUrl);
export const db = drizzle(conn, { schema });
