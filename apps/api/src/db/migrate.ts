import { migrate } from 'drizzle-orm/mysql2/migrator'
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bun_auth_api',
  ssl: process.env.DB_SSL === 'true' || process.env.DB_HOST?.includes('tidbcloud.com')
    ? { minVersion: 'TLSv1.2', rejectUnauthorized: true }
    : undefined,
})

const db = drizzle(connection)

await migrate(db, { migrationsFolder: './drizzle' })
console.log('Migration completed successfully!')

await connection.end()
process.exit(0)
