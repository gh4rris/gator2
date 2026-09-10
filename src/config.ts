import fs from "fs";
import os from "os";
import path from "path";


type Config = {
    dbUrl: string;
    currentUserName: string;
}


export function setUser(userName: string): void {
    const cfg = readConfig();
    cfg.currentUserName = userName;
    writeConfig(cfg);
}


export function readConfig(): Config {
    const path = getConfigFilePath()
    const data = fs.readFileSync(path, "utf8");
    const rawConfig = JSON.parse(data);
    return validateConfig(rawConfig);
}


function getConfigFilePath(): string {
    const homePath = os.homedir();
    return path.join(homePath, ".gatorconfig.json");
}


function validateConfig(rawConfig: any): Config {
    if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
        throw new Error("db_url is required for config file");
    }

    return {
        dbUrl: rawConfig.db_url,
        currentUserName: rawConfig.current_user_name ?? ""
    };
}


function writeConfig(cfg: Config): void {
    const path = getConfigFilePath()
    const rawConfig = {
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName
    }
    const data = JSON.stringify(rawConfig, null, 2);
    fs.writeFileSync(path, data)
}

