FROM node:20-alpine AS development-dependencies-env
COPY ./trs-admin/package.json ./trs-admin/package-lock.json /app/
COPY ./trs-db /trs-db
WORKDIR /app
RUN npm ci

# Generate Prisma client
WORKDIR /trs-db
RUN npm ci
RUN npx prisma generate --schema=schema.prisma
WORKDIR /app

FROM node:20-alpine AS production-dependencies-env
COPY ./trs-admin/package.json ./trs-admin/package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-alpine AS build-env
COPY ./trs-admin /app/
COPY ./trs-db /trs-db
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
COPY --from=development-dependencies-env /trs-db/node_modules /trs-db/node_modules
COPY --from=development-dependencies-env /trs-db/generated /trs-db/generated
WORKDIR /app
RUN npm run build

FROM node:20-alpine
COPY ./trs-admin/package.json ./trs-admin/package-lock.json /app/
COPY ./trs-db /trs-db
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=development-dependencies-env /trs-db/node_modules /trs-db/node_modules
COPY --from=development-dependencies-env /trs-db/generated /trs-db/generated
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["npm", "run", "start"]