import { readConfig } from "./src/config";

import { defineConfig } from "drizzle-kit";


const config = readConfig()

export default defineConfig({
    schema: "src/lib/db/schema.ts",
    out: "src/lib/db/migrations.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: config.dbUrl
    }
});
