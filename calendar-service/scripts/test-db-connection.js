"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_js_1 = require("drizzle-orm/postgres-js");
const drizzle_orm_1 = require("drizzle-orm");
const postgresModule = __importStar(require("postgres"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const database_1 = require("@corpcal/database");
let dotenv = null;
try {
    dotenv = require('dotenv');
}
catch {
}
function maskConnectionString(connectionString) {
    try {
        const url = new URL(connectionString);
        if (url.password) {
            url.password = '***';
        }
        return url.toString();
    }
    catch {
        if (connectionString.length > 20) {
            return `${connectionString.substring(0, 10)}...${connectionString.substring(connectionString.length - 10)}`;
        }
        return '***';
    }
}
async function testDatabaseConnection() {
    const envPath = path.join(__dirname, '../.env');
    if (dotenv && fs.existsSync(envPath)) {
        dotenv.config({ path: envPath });
    }
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('ERROR: DATABASE_URL environment variable is required.');
        console.error('Please set it in your .env file or as an environment variable.');
        process.exit(1);
    }
    console.log(`Connecting to database: ${maskConnectionString(connectionString)}`);
    try {
        const postgres = postgresModule.default || postgresModule;
        const maxConnections = parseInt(process.env.DB_MAX_CONNECTIONS || '10', 10);
        const idleTimeout = parseInt(process.env.DB_IDLE_TIMEOUT || '20', 10);
        const connectTimeout = parseInt(process.env.DB_CONNECT_TIMEOUT || '10', 10);
        const queryClient = postgres(connectionString, {
            max: maxConnections,
            idle_timeout: idleTimeout,
            connect_timeout: connectTimeout,
            connection: {
                application_name: 'calendar-service-test',
            },
        });
        const db = (0, postgres_js_1.drizzle)(queryClient, { schema: database_1.schema });
        console.log('📊 Testing database connection...');
        const result = await db.execute((0, drizzle_orm_1.sql) `SELECT 1 as test`);
        console.log('✅ Database connection successful!');
        console.log(`   Query result: ${JSON.stringify(result)}`);
        await queryClient.end();
        console.log('✅ Connection test completed successfully.');
        process.exit(0);
    }
    catch (error) {
        console.error('Error: Database connection failed!');
        console.error('Error details:', error instanceof Error ? error.message : error);
        if (error instanceof Error && error.stack) {
            console.error('Stack trace:', error.stack);
        }
        process.exit(1);
    }
}
testDatabaseConnection();
//# sourceMappingURL=test-db-connection.js.map