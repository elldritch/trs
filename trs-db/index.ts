import { PrismaClient } from '@prisma/client'

export * from '@prisma/client'

// Note: I am not sure if this is the best practice for
// using the data model across both apps, so don't hesitate
// to change it!
export const prisma = new PrismaClient()
