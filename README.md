Next.js + MySQL + Next-Connect + Prisma (DB) ORM

Run a migration to create your database tables with Prisma Migrate
https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#datetime

DB Prisma init create table in Folder prisma/schema.prisma

```bash
1. yarn install
2. npx prisma migrate dev --name init #กรณียังไม่มีดาต้าเบส
3. npx prisma generate #กรณีมีดาต้าเบสแล้ว
3. http://localhost:3000/api/prisma/init #init ข้อมูลลงในดาต้าเบส
4. yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
Admin Page Open [http://localhost:3000/admin] with `User, Banner, News, Contact` page

```bash
Username: admin
Password: 1234
```

For Docker

```bash
1. docker build -t test-next-docker .
2. docker run -p 3000:3000 --name testDocker test-next-docker
```
