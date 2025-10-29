# TRS

This repository is for the 2025 Arbor Halloween event.

## Quickstart

```bash
cd turbotreat
npm install
npm run dev
```

## Running the database
```bash
cd trs-db
npm install
docker compose up -d
```
If it's the first time you're running the database, you'll need to create the tables etc:
```bash
npx prisma migrate dev
```

After any changes to the data model, run:
```bash
npx prisma generate
```

