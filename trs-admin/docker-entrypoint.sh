#!/bin/sh
set -e

# Run database migrations
cd /trs-db
npx prisma migrate deploy

# Start the application
cd /app
exec npm run start
