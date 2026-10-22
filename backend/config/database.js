"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ env }) => {
    const client = env("DATABASE_CLIENT", "postgres");
    const connection = {
        connectionString: env("DATABASE_URL", undefined),
        host: env("DATABASE_HOST", "127.0.0.1"),
        port: env.int("DATABASE_PORT", 5432),
        database: env("DATABASE_NAME", "labkhand_nini"),
        user: env("DATABASE_USERNAME", "postgres"),
        password: env("DATABASE_PASSWORD", ""),
        ssl: env.bool("DATABASE_SSL", false)
            ? { rejectUnauthorized: env.bool("DATABASE_SSL_SELF", false) }
            : false,
        schema: env("DATABASE_SCHEMA", "public"),
    };
    return {
        connection: {
            client,
            connection: client === "postgres" ? connection : {},
            pool: {
                min: env.int("DATABASE_POOL_MIN", 0),
                max: env.int("DATABASE_POOL_MAX", 10),
            },
            acquireConnectionTimeout: env.int("DATABASE_CONNECTION_TIMEOUT", 60000),
        },
    };
};
