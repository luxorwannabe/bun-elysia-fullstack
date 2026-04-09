import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema.js'

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bun_auth_api',
  waitForConnections: true,
  connectionLimit: 10,
  ssl: process.env.DB_SSL === 'true' || process.env.DB_HOST?.includes('tidbcloud.com')
    ? { minVersion: 'TLSv1.2', rejectUnauthorized: true }
    : undefined,
})

export const db = drizzle(pool, { schema, mode: 'default' })
