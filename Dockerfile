FROM alpine:latest
RUN apk add --no-cache nodejs npm
RUN npm install -g yarn
RUN apk add --no-cache mysql-client

WORKDIR /app

COPY . /app

RUN yarn install
# RUN npx prisma migrate dev --name init
# RUN npx prisma generate
RUN npx prisma generate
ENTRYPOINT ["yarn", "dev"]

EXPOSE 3000