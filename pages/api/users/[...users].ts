import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth } from "@/pages/api/middleware";
import connection from "@/mysql";
import formidable from "formidable";
const bcrypt = require("bcrypt");
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
      const [response]: Users[] = await connection.query(
        `SELECT user_id, fullname, email FROM users WHERE status = "Active" AND level = "User" ORDER BY fullname ASC, created_at DESC`
      );
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
      const { username, password, fullname, email, level } = fields;
      await connection.query("ALTER TABLE users AUTO_INCREMENT = 1");
      const [check] = await connection.query(
        "SELECT * FROM users WHERE username = ? AND status = ? ",
        [username, "active"]
      );
      if (check.length === 0) {
        const hashSync = bcrypt.hashSync(password, 12);
        await connection.query(
          "INSERT INTO users (username, password, fullname, email, level) " +
            " VALUES (?, ?, ?, ?, ?)",
          [username, hashSync, fullname, email, level]
        );
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
      const { user_id } = fields;
      await connection.query(
        `UPDATE users SET status = "Inactive" WHERE user_id = ${user_id}`
      );
      res.status(200).json({ status: "success" });
    });
  }
);

router.post(
  "/api/users/deleteall",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      const { user_id } = fields;
      let id = user_id.toString();
      await connection.query(
        `UPDATE users SET status = "Inactive" WHERE user_id IN (${id})`
      );
      res.status(200).json({ status: "success" });
    });
  }
);

export default router.handler({
  onError: (err: any, req: NextApiRequest, res: NextApiResponse) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(404).end("Page is not found");
  },
});
