import {PrismaClient as MainPrismaClient} from '@/generated/prisma-main'
import {PrismaClient as NeonPrismaClient} from '@/generated/prisma-neon'
import {PrismaClient as MysqlPrismaClient} from '@/generated/prisma-mysql'
import {PrismaClient as SqlitePrismaClient} from '@/generated/prisma-sqlite'

// Singleton per ciascun database
const globalForMain = global as any
const globalForNeon = global as any
const globalForMysql = global as any
const globalForSqlite = global as any

export const mainDb = globalForMain.mainDb || new MainPrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
})

export const neonDb = globalForNeon.neonDb || new NeonPrismaClient({
    log: ['error'],
})

export const mysqlDb = globalForMysql.mysqlDb || new MysqlPrismaClient({
    log: ['error'],
})

export const sqliteDb = globalForSqlite.sqliteDb || new SqlitePrismaClient({
    log: ['error'],
})

if (process.env.NODE_ENV !== 'production') {
    globalForMain.mainDb = mainDb
    globalForNeon.neonDb = neonDb
    globalForMysql.mysqlDb = mysqlDb
    globalForSqlite.sqliteDb = sqliteDb
}