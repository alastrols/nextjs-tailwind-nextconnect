import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth } from "@/pages/api/middleware";
import connection from "@/mysql";
import formidable from "formidable";
import prisma from "@/prisma";
const bcrypt = require("bcrypt");
const fs = require("fs");
const XLSX = require("xlsx");
export const config = {
  api: {
    bodyParser: false,
  },
};

import { createRouter } from "next-connect";
const router = createRouter<NextApiRequest, NextApiResponse>();

declare module "next" {
  interface NextApiRequest {
    decoded: any;
  }
}

interface UserData {
  user_id?: string;
  fullname?: string;
  email?: string;
  username?: string;
  level?: string;
}
interface Users extends Array<UserData> {}

// Middleware
router.use(async (req: NextApiRequest, res: NextApiResponse, next) => {
  const decoded = await adminAuth(req, res);
  req.decoded = decoded;
  await next();
});

router.get(
  "/api/users/lists",
  async (req: NextApiRequest, res: NextApiResponse, next: any) => {
    try {
      // const [response]: any = await connection.query(
      //   `SELECT user_id, fullname, email, username, level FROM users WHERE (status = "Active" AND username != "admin")  ORDER BY fullname ASC, created_at DESC`
      // );
      const response = await prisma.users.findMany({
        where: {
          status: "Active",
          NOT: {
            username: "admin",
          },
        },
        orderBy: [
          {
            fullname: "asc",
          },
          {
            created_at: "desc",
          },
        ],
      });
      res.status(200).json({ status: "success", data: response });
    } catch {
      res.status(200).json({ status: "error", message: "Invalid Token" });
    }
  }
);

router.get(
  "/api/users/get",
  async (req: NextApiRequest, res: NextApiResponse, next: any) => {
    const { keyword } = req.query;
    try {
      // const [response]: any = await connection.query(
      //   `SELECT user_id, fullname, email, username, level FROM users WHERE (status = "Active" AND username != "admin")  AND (fullname LIKE ? OR email LIKE ? OR username LIKE ? OR level LIKE ?) ORDER BY fullname ASC, created_at DESC`,
      //   [
      //     "%" + keyword + "%",
      //     "%" + keyword + "%",
      //     "%" + keyword + "%",
      //     "%" + keyword + "%",
      //   ]
      // );
      const response = await prisma.$queryRawUnsafe(
        `SELECT user_id, fullname, email, username, level FROM users WHERE (status = "Active" AND username != "admin")  AND (fullname LIKE ? OR email LIKE ? OR username LIKE ? OR level LIKE ?) ORDER BY fullname ASC, created_at DESC`,
        "%" + keyword + "%",
        "%" + keyword + "%",
        "%" + keyword + "%",
        "%" + keyword + "%"
      );
      res.status(200).json({ status: "success", data: response });
    } catch {
      res.status(200).json({ status: "error", message: "Invalid Token" });
    }
  }
);

router.get(
  "/api/users/getbyid",
  async (req: NextApiRequest, res: NextApiResponse, next: any) => {
    const { id }: any = req.query;
    try {
      // const [response]: any = await connection.query(
      //   `SELECT user_id, fullname, email, username, level FROM users WHERE status = "Active" AND username != "admin" AND user_id = ?`,
      //   [id]
      // );
      const response = await prisma.users.findMany({
        where: {
          AND: [
            {
              status: {
                equals: "Active",
              },
              user_id: {
                equals: parseInt(id),
              },
            },
          ],
          NOT: {
            username: "admin",
          },
        },
      });
      console.log(response);
      res.status(200).json({ status: "success", data: response });
    } catch {
      res.status(200).json({ status: "error", message: "Invalid Token" });
    }
  }
);

router.put(
  "/api/users/create",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      const { username, password, fullname, email, level }: any = fields;
      await connection.query("ALTER TABLE users AUTO_INCREMENT = 1");
      const [check]: any = await connection.query(
        "SELECT * FROM users WHERE username = ? AND status = ? ",
        [username.toString(), "active"]
      );
      if (check.length === 0) {
        const hashSync = bcrypt.hashSync(password.toString(), 12);
        // await connection.query(
        //   "INSERT INTO users (username, password, fullname, email, level) " +
        //     " VALUES (?, ?, ?, ?, ?)",
        //   [
        //     username.toString(),
        //     hashSync,
        //     fullname.toString(),
        //     email.toString(),
        //     level.toString(),
        //   ]
        // );
        await prisma.users.create({
          data: {
            username: username.toString(),
            password: hashSync,
            fullname: fullname.toString(),
            email: email.toString(),
            level: level.toString(),
          },
        });
        res.status(200).json({ status: "success" });
      } else {
        res
          .status(200)
          .json({ status: "error", message: "Duplicate Username" });
      }
    });
  }
);

router.post(
  "/api/users/edit",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      const { user_id, username, password, fullname, email, level }: any =
        fields;
      // const [check]: any = await connection.query(
      //   "SELECT user_id FROM users WHERE status = 'active' AND user_id != ? AND username = ?",
      //   [user_id, username.toString()]
      // );
      const check = await prisma.users.findMany({
        where: {
          AND: {
            status: {
              equals: "Active",
            },
            username: {
              equals: username.toString(),
            },
          },
          NOT: {
            user_id: parseInt(user_id),
          },
        },
      });

      if (check.length === 0) {
        if (password != "") {
          const hashSync = bcrypt.hashSync(password.toString(), 12);
          // await connection.query(
          //   "UPDATE users SET password = ? WHERE user_id = ?",
          //   [hashSync, user_id]
          // );
          await prisma.users.update({
            data: {
              password: hashSync,
            },
            where: {
              user_id: parseInt(user_id.toString()),
            },
          });
        }
        // await connection.query(
        //   "UPDATE users SET username = ?, fullname = ?, email = ?, level = ? WHERE user_id = ?",
        //   [username, fullname, email, level, user_id]
        // );
        await prisma.users.update({
          data: {
            username: username.toString(),
            fullname: fullname.toString(),
            email: email.toString(),
            level: level.toString(),
          },
          where: {
            user_id: parseInt(user_id.toString()),
          },
        });
        res.status(200).json({ status: "success" });
      } else {
        res
          .status(200)
          .json({ status: "error", message: "Duplicate Username" });
      }
    });
  }
);

router.post(
  "/api/users/delete",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      const { user_id }: any = fields;
      // await connection.query(
      //   `UPDATE users SET status = "Inactive" WHERE user_id = ${user_id}`
      // );
      await prisma.users.delete({
        where: {
          user_id: parseInt(user_id?.toString()),
        },
      });
      res.status(200).json({ status: "success" });
    });
  }
);

router.post(
  "/api/users/deleteall",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      const { user_id }: any = fields;
      let id = user_id.toString();
      // await connection.query(
      //   `UPDATE users SET status = "Inactive" WHERE user_id IN (${id})`
      // );
      await prisma.$queryRawUnsafe(
        `DELETE FROM users WHERE user_id IN (${id})`
      );
      res.status(200).json({ status: "success" });
    });
  }
);

router.post(
  "/api/users/upload",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const form = formidable();
    form.parse(req, async (err, fields, files: any) => {
      fs.copyFileSync(
        files.file[0].filepath,
        `public/upload/users/${files.file[0].originalFilename}`
      );
      var reponse = await importExcelUser(
        `public/upload/users/${files.file[0].originalFilename}`
      ).then((result) => {
        return result;
      });
      res.status(200).json({ status: "success" });
    });
  }
);

async function importExcelUser(url: string) {
  const workbook = XLSX.readFile(url);
  let worksheets = workbook.SheetNames.map((sheetName: string) => {
    return {
      sheetName,
      data: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]),
    };
  });
  const toJson = JSON.parse(JSON.stringify(worksheets));
  const data = toJson[0].data;
  let status = "success";
  await Promise.all(
    data.map(async (rows: any, index: any) => {
      const fullname = rows["Fullname"];
      const email = rows["Email"];
      const username = rows["Username"];
      const pass = rows["Password"];
      // const [check]: any = await connection.query(
      //   "SELECT user_id FROM users WHERE status = 'active' AND username = ? ",
      //   [username]
      // );
      const check = await prisma.users.findMany({
        where: {
          AND: {
            status: {
              equals: "Active",
            },
            username: {
              equals: username.toString(),
            },
          },
        },
      });
      if (check.length == 0) {
        var hashedPassword = await bcrypt.hashSync(String(pass), 12);
        var password = hashedPassword;
        // const [add] = await connection.query(
        //   "INSERT INTO users (fullname , username ,  password , email, status, level) VALUES (? , ? , ? , ? , ? , ?)",
        //   [fullname, username, password, email, "active", "User"]
        // );

        await prisma.users.create({
          data: {
            fullname: fullname,
            password: password,
            username: username,
            email: email,
            status: "Active",
            level: "User",
          },
        });
      } else {
        status = "duplicate";
      }
    })
  );

  return status;
}

export default router.handler({
  onError: (err: any, req: NextApiRequest, res: NextApiResponse) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(404).end("Page is not found");
  },
});
