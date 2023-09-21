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
interface Data {
  banner_id?: string;
  post_date?: string;
  topic?: string;
  filename?: string;
  status?: string;
}
interface Banner extends Array<Data> {}
// Middleware
router.use(async (req: NextApiRequest, res: NextApiResponse, next) => {
  const decoded = await adminAuth(req, res);
  req.decoded = decoded;
  await next();
});

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
      fs.copyFileSync(
        files.file[0].filepath,
        `public/upload/banner/${name.toString()}`
      );
      await connection.query(
        "UPDATE banner SET filename = ? WHERE banner_id = ?",
        [name.toString(), banner_id.toString()]
      );
      await connection.query(
        "UPDATE banner SET post_date = ?, topic = ?, status = ? WHERE banner_id = ?",
        [
          post_date.toString(),
          topic.toString(),
          status.toString(),
          banner_id.toString(),
        ]
      );
      res.status(200).json({ status: "success" });
    });
  }
);

router.post(
  "/api/tinyupload",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const form = formidable();
    const host = req.headers.origin;
    console.log(host);
    form.parse(req, async (err, fields, files: any) => {
      const name =
        Math.random().toString(16).slice(2) +
        "_" +
        files.file[0].originalFilename;
      fs.copyFileSync(
        files.file[0].filepath,
        `public/upload/tinyupload/${name}`
      );
      res.status(200).json({
        status: "success",
        location: `${host}/upload/tinyupload/${name.toString()}`,
        alt: name,
      });
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
