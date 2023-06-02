import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth } from "@/pages/api/middleware";
import connection from "@/mysql";
import formidable from "formidable";
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
// interface Data {
//   banner_id?: string;
//   post_date?: string;
//   topic?: string;
//   filename?: string;
//   status?: string;
// }
// interface Banner extends Array<Data> {}
// Middleware
router.use(async (req: NextApiRequest, res: NextApiResponse, next) => {
  const decoded = await adminAuth(req, res);
  req.decoded = decoded;
  await next();
});

router.get(
  "/api/banner/lists",
  async (req: NextApiRequest, res: NextApiResponse, next: any) => {
    try {
      const [response] = await connection.query(
        `SELECT banner_id, post_date, topic, filename, status FROM banner WHERE active = "Yes" ORDER BY arr ASC`
      );
      res.status(200).json({ status: "success", data: response });
    } catch {
      res.status(200).json({ status: "error", message: "Invalid Token" });
    }
  }
);

router.get(
  "/api/banner/get",
  async (req: NextApiRequest, res: NextApiResponse, next: any) => {
    const { keyword } = req.query;
    try {
      const [response] = await connection.query(
        `SELECT banner_id, post_date, topic, filename, status FROM banner WHERE active = "Yes"  AND (post_date LIKE ? OR topic LIKE ? ) ORDER BY arr ASC`,
        ["%" + keyword + "%", "%" + keyword + "%"]
      );
      res.status(200).json({ status: "success", data: response });
    } catch {
      res.status(200).json({ status: "error", message: "Invalid Token" });
    }
  }
);

router.get(
  "/api/banner/getbyid",
  async (req: NextApiRequest, res: NextApiResponse, next: any) => {
    const { id } = req.query;
    try {
      const [response] = await connection.query(
        `SELECT banner_id, post_date, topic, filename, status FROM banner WHERE active = "Yes" AND banner_id = ?`,
        [id]
      );
      res.status(200).json({ status: "success", data: response });
    } catch {
      res.status(200).json({ status: "error", message: "Invalid Token" });
    }
  }
);

router.put(
  "/api/banner/create",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const form = formidable();
    form.parse(req, async (err, fields, files: any) => {
      const { topic, post_date, status, filename } = fields;
      const name =
        Math.random().toString(16).slice(2) + "_" + files.file.originalFilename;
      fs.copyFileSync(files.file.filepath, `public/upload/banner/${name}`);
      let arr = 0;
      const [check]: any = await connection.query(
        "SELECT MAX(arr) as arr FROM banner"
      );
      if (check[0].arr != null) {
        arr = check[0].arr + 1;
      }
      await connection.query(
        "INSERT INTO banner (topic , post_date ,  status , filename, arr) VALUES (? , ? , ? , ?, ?)",
        [topic, post_date, status, name, arr]
      );
      res.status(200).json({ status: "success" });
    });
  }
);

router.post(
  "/api/banner/edit",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      const { banner_id, post_date, topic, status } = fields;
      await connection.query(
        "UPDATE banner SET post_date = ?, topic = ?, status = ? WHERE banner_id = ?",
        [post_date, topic, status, banner_id]
      );
      res.status(200).json({ status: "success" });
    });
  }
);

router.post(
  "/api/banner/edit/withimage",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const form = formidable();
    form.parse(req, async (err, fields, files: any) => {
      const { banner_id, post_date, topic, status } = fields;
      const name =
        Math.random().toString(16).slice(2) + "_" + files.file.originalFilename;
      fs.copyFileSync(files.file.filepath, `public/upload/banner/${name}`);
      await connection.query(
        "UPDATE banner SET filename = ? WHERE banner_id = ?",
        [name, banner_id]
      );
      await connection.query(
        "UPDATE banner SET post_date = ?, topic = ?, status = ? WHERE banner_id = ?",
        [post_date, topic, status, banner_id]
      );
      res.status(200).json({ status: "success" });
    });
  }
);

router.post(
  "/api/banner/delete",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      const { banner_id } = fields;
      await connection.query(
        `UPDATE banner SET active = "No" WHERE banner_id = ${banner_id}`
      );
      res.status(200).json({ status: "success" });
    });
  }
);

router.post(
  "/api/banner/deleteall",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      const { banner_id } = fields;
      let id = banner_id.toString();
      await connection.query(
        `UPDATE banner SET active = "No" WHERE banner_id IN (${id})`
      );
      res.status(200).json({ status: "success" });
    });
  }
);

router.post(
  "/api/banner/sortable",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const form = formidable();
    form.parse(req, async (err: any, fields: any, files: any) => {
      for (const [key, value] of Object.entries(fields)) {
        const data: any = value;
        const id: any = data.banner_id;
        await connection.query(
          `UPDATE banner SET arr = ? WHERE banner_id = ?`,
          [key, id]
        );
      }
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
