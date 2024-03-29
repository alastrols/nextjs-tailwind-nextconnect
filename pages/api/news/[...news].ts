import type { NextApiRequest, NextApiResponse } from "next";
import { adminAuth } from "@/pages/api/middleware";
import connection from "@/mysql";
import formidable from "formidable";
export const config = {
  api: {
    bodyParser: false,
  },
};

import { createRouter } from "next-connect";
import prisma from "@/prisma";

const router = createRouter<NextApiRequest, NextApiResponse>();

declare module "next" {
  interface NextApiRequest {
    decoded: any;
  }
}

interface Data {
  news_id?: string;
  post_date?: string;
  topic?: string;
  status?: string;
}
interface News extends Array<Data> {}

// Middleware
router.use(async (req: NextApiRequest, res: NextApiResponse, next) => {
  const decoded = await adminAuth(req, res);
  req.decoded = decoded;
  await next();
});

router.get(
  "/api/news/lists",
  async (req: NextApiRequest, res: NextApiResponse, next: any) => {
    try {
      // const [response]: any = await connection.query(
      //   `SELECT news_id, post_date, topic, status FROM news ORDER BY post_date DESC, created_at DESC`
      // );
      // res.status(200).json({ status: "success", data: response });
      const response = await prisma.news.findMany({
        orderBy: [
          {
            post_date: "desc",
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
  "/api/news/get",
  async (req: NextApiRequest, res: NextApiResponse, next: any) => {
    const { keyword } = req.query;
    try {
      // const [response]: any = await connection.query(
      //   `SELECT news_id, post_date, topic, status FROM news
      //    WHERE post_date LIKE ? OR topic LIKE ? OR status LIKE ? ORDER BY post_date DESC, created_at DESC`,
      //   ["%" + keyword + "%", "%" + keyword + "%", "%" + keyword + "%"]
      // );
      // res.status(200).json({ status: "success", data: response });
      const response = await prisma.$queryRawUnsafe(
        "SELECT news_id, post_date, topic, status FROM news WHERE post_date LIKE ? OR topic LIKE ? OR status LIKE ? ORDER BY post_date DESC, created_at DESC",
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
  "/api/news/getbyid",
  async (req: NextApiRequest, res: NextApiResponse, next: any) => {
    const { id }: any = req.query;
    try {
      // const [response]: any = await connection.query(
      //   `SELECT news_id, post_date, topic, status, detail FROM news WHERE news_id = ?`,
      //   [id?.toString()]
      // );

      const response = await prisma.news.findMany({
        where: {
          news_id: parseInt(id),
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
  "/api/news/create",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      const { post_date, topic, status, detail }: any = fields;
      // await connection.query(
      //   `INSERT INTO news (post_date, topic, status, detail)
      //    VALUES (?, ?, ?, ?)`,
      //   [
      //     post_date?.toString(),
      //     topic?.toString(),
      //     status?.toString(),
      //     detail?.toString(),
      //   ]
      // );
      await prisma.news.create({
        data: {
          post_date: new Date(post_date?.toString()),
          topic: topic?.toString(),
          status: status?.toString(),
          detail: detail?.toString(),
        },
      });
      res.status(200).json({ status: "success" });
    });
  }
);

router.post(
  "/api/news/edit",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      const { news_id, post_date, topic, status, detail }: any = fields;
      // await connection.query(
      //   `UPDATE news SET post_date = ?, topic = ?, status = ?, detail = ? WHERE news_id = ?`,
      //   [
      //     post_date?.toString(),
      //     topic?.toString(),
      //     status?.toString(),
      //     detail?.toString(),
      //     news_id?.toString(),
      //   ]
      // );
      await prisma.news.update({
        data: {
          post_date: new Date(post_date?.toString()),
          topic: topic?.toString(),
          status: status?.toString(),
          detail: detail?.toString(),
        },
        where: {
          news_id: parseInt(news_id),
        },
      });
      res.status(200).json({ status: "success" });
    });
  }
);

router.post(
  "/api/news/delete",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      const { news_id }: any = fields;
      // await connection.query(
      //   `DELETE FROM news WHERE news_id = ${news_id?.toString()}`
      // );
      await prisma.news.delete({
        where: {
          news_id: parseInt(news_id?.toString()),
        },
      });
      res.status(200).json({ status: "success" });
    });
  }
);

router.post(
  "/api/news/deleteall",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      const { news_id }: any = fields;
      let id = news_id.toString();
      // await connection.query(`DELETE FROM news WHERE news_id IN (${id})`);
      await prisma.$queryRawUnsafe(`DELETE FROM news WHERE news_id IN (${id})`);
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
