Next.js + MySQL + Next-Connect + Prisma (DB) ORM

Run a migration to create your database tables with Prisma Migrate
https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#datetime

DB Prisma init create table in Folder prisma/schema.prisma

```bash
1. yarn install
2. npx prisma migrate dev --name init
3. http://localhost:3000/api/prisma/init
4. yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
Admin Page Open [http://localhost:3000/admin] with `User, Banner, News, Contact` page

```bash
Username: admin
Password: 1234
```
