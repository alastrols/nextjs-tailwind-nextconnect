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
      // const [response] = await connection.query(
      //   `SELECT banner_id, post_date, topic, filename, status FROM banner WHERE active = "Yes" ORDER BY arr ASC`
      // );
      const response = await prisma.banner.findMany({
        where: {
          active: "Yes",
        },
        orderBy: [
          {
            arr: "asc",
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
  "/api/banner/get",
  async (req: NextApiRequest, res: NextApiResponse, next: any) => {
    const { keyword } = req.query;
    try {
      // const [response] = await connection.query(
      //   `SELECT banner_id, post_date, topic, filename, status FROM banner WHERE active = "Yes"  AND (post_date LIKE ? OR topic LIKE ? ) ORDER BY arr ASC`,
      //   ["%" + keyword + "%", "%" + keyword + "%"]
      // );
      const response = await prisma.$queryRawUnsafe(
        `SELECT banner_id, post_date, topic, filename, status FROM banner WHERE active = "Yes"  AND (post_date LIKE ? OR topic LIKE ? ) ORDER BY arr ASC`,
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
  "/api/banner/getbyid",
  async (req: NextApiRequest, res: NextApiResponse, next: any) => {
    const { id }: any = req.query;
    try {
      // const [response] = await connection.query(
      //   `SELECT banner_id, post_date, topic, filename, status FROM banner WHERE active = "Yes" AND banner_id = ?`,
      //   [id]
      // );
      const response = await prisma.banner.findMany({
        where: {
          AND: [
            {
              active: {
                equals: "Yes",
              },
              banner_id: {
                equals: parseInt(id),
              },
            },
          ],
        },
      });

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
      const { topic, post_date, status, filename }: any = fields;
      const name =
        Math.random().toString(16).slice(2) +
        "_" +
        files.file[0].originalFilename;
      fs.copyFileSync(files.file[0].filepath, `public/upload/banner/${name}`);
      let arr = 0;
      // const [check]: any = await connection.query(
      //   "SELECT MAX(arr) as arr FROM banner"
      // );
      const check: any = await prisma.$queryRawUnsafe(
        `SELECT MAX(arr) as arr FROM banner`
      );
      if (check[0].arr != null) {
        arr = check[0].arr + 1;
      }
      // await connection.query(
      //   "INSERT INTO banner (topic , post_date ,  status , filename, arr) VALUES (? , ? , ? , ?, ?)",
      //   [
      //     topic.toString(),
      //     post_date.toString(),
      //     status.toString(),
      //     name.toString(),
      //     arr,
      //   ]
      // );
      await prisma.banner.create({
        data: {
          topic: topic.toString(),
          post_date: new Date(post_date?.toString()),
          status: status.toString(),
          filename: name,
          arr: arr,
        },
      });
      res.status(200).json({ status: "success" });
    });
  }
);

router.post(
  "/api/banner/edit",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      const { banner_id, post_date, topic, status }: any = fields;
      // await connection.query(
      //   "UPDATE banner SET post_date = ?, topic = ?, status = ? WHERE banner_id = ?",
      //   [post_date, topic, status, banner_id]
      // );
      await prisma.banner.update({
        data: {
          topic: topic.toString(),
          post_date: new Date(post_date?.toString()),
          status: status.toString(),
        },
        where: {
          banner_id: parseInt(banner_id.toString()),
        },
      });
      res.status(200).json({ status: "success" });
    });
  }
);

router.post(
  "/api/banner/edit/withimage",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const form = formidable();
    form.parse(req, async (err, fields, files: any) => {
      const { banner_id, post_date, topic, status }: any = fields;
      const name =
        Math.random().toString(16).slice(2) +
        "_" +
        files.file[0].originalFilename;
      fs.copyFileSync(files.file[0].filepath, `public/upload/banner/${name}`);
      // await connection.query(
      //   "UPDATE banner SET filename = ? WHERE banner_id = ?",
      //   [name.toString(), banner_id.toString()]
      // );
      await prisma.banner.update({
        data: {
          filename: name.toString(),
        },
        where: {
          banner_id: parseInt(banner_id.toString()),
        },
      });
      // await connection.query(
      //   "UPDATE banner SET post_date = ?, topic = ?, status = ? WHERE banner_id = ?",
      //   [
      //     post_date.toString(),
      //     topic.toString(),
      //     status.toString(),
      //     banner_id.toString(),
      //   ]
      // );
      await prisma.banner.update({
        data: {
          topic: topic.toString(),
          post_date: new Date(post_date?.toString()),
          status: status.toString(),
        },
        where: {
          banner_id: parseInt(banner_id.toString()),
        },
      });
      res.status(200).json({ status: "success" });
    });
  }
);

router.post(
  "/api/banner/delete",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      const { banner_id }: any = fields;
      // await connection.query(
      //   `UPDATE banner SET active = "No" WHERE banner_id = ${banner_id.toString()}`
      // );
      await prisma.banner.update({
        data: {
          active: "No",
        },
        where: {
          banner_id: parseInt(banner_id.toString()),
        },
      });
      res.status(200).json({ status: "success" });
    });
  }
);

router.post(
  "/api/banner/deleteall",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      const { banner_id }: any = fields;
      let id = banner_id.toString();
      // await connection.query(
      //   `UPDATE banner SET active = "No" WHERE banner_id IN (${id})`
      // );
      await prisma.$queryRawUnsafe(
        `DELETE FROM banner WHERE banner_id IN (${id})`
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
        // await connection.query(
        //   `UPDATE banner SET arr = ? WHERE banner_id = ?`,
        //   [key, id]
        // );
        await prisma.banner.update({
          data: {
            arr: parseInt(key),
          },
          where: {
            banner_id: parseInt(id.toString()),
          },
        });
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
