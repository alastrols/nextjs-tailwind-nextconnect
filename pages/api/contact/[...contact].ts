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
import prisma from "@/prisma";
const router = createRouter<NextApiRequest, NextApiResponse>();

declare module "next" {
  interface NextApiRequest {
    decoded: any;
  }
}

// interface Data {
//   contact_id?: string;
//   fullname?: string;
//   email?: string;
//   company_name?: string;
//   phone_number?: string;
//   message?: string;
//   subject?: string;
//   created_at?: string;
// }
// interface Contact extends Array<Data> {}

// Middleware
router.use(async (req: NextApiRequest, res: NextApiResponse, next) => {
  const decoded = await adminAuth(req, res);
  req.decoded = decoded;
  await next();
});

router.get(
  "/api/contact/lists",
  async (req: NextApiRequest, res: NextApiResponse, next: any) => {
    try {
      // const [response]: any = await connection.query(
      //   `SELECT contact_id, fullname, company_name, phone_number, email, message, created_at, subject FROM contact
      //    ORDER BY created_at DESC`
      // );
      const response = await prisma.contact.findMany({
        orderBy: {
          created_at: "desc",
        },
      });
      res.status(200).json({ status: "success", data: response });
    } catch {
      res.status(200).json({ status: "error", message: "Invalid Token" });
    }
  }
);

router.get(
  "/api/contact/get",
  async (req: NextApiRequest, res: NextApiResponse, next: any) => {
    const { keyword } = req.query;
    try {
      // const [response]: any = await connection.query(
      //   `SELECT contact_id, fullname, company_name, phone_number, email, message, created_at, subject FROM contact
      //    WHERE fullname LIKE ? OR company_name LIKE ? OR phone_number LIKE ? OR email LIKE ? OR subject LIKE ? OR created_at LIKE ? ORDER BY created_at DESC`,
      //   [
      //     "%" + keyword?.toString() + "%",
      //     "%" + keyword?.toString() + "%",
      //     "%" + keyword?.toString() + "%",
      //     "%" + keyword?.toString() + "%",
      //     "%" + keyword?.toString() + "%",
      //     "%" + keyword?.toString() + "%",
      //   ]
      // );

      const response = await prisma.$queryRawUnsafe(
        `SELECT contact_id, fullname, company_name, phone_number, email, message, created_at, subject FROM contact
          WHERE fullname LIKE ? OR company_name LIKE ? OR phone_number LIKE ? OR email LIKE ? OR subject LIKE ? OR created_at LIKE ? ORDER BY created_at DESC`,
        "%" + keyword?.toString() + "%",
        "%" + keyword?.toString() + "%",
        "%" + keyword?.toString() + "%",
        "%" + keyword?.toString() + "%",
        "%" + keyword?.toString() + "%",
        "%" + keyword?.toString() + "%"
      );
      res.status(200).json({ status: "success", data: response });
    } catch {
      res.status(200).json({ status: "error", message: "Invalid Token" });
    }
  }
);

router.get(
  "/api/contact/getbyid",
  async (req: NextApiRequest, res: NextApiResponse, next: any) => {
    const { id }: any = req.query;
    try {
      // const [response]: any = await connection.query(
      //   `SELECT contact_id, fullname, company_name, phone_number, email, message, created_at, subject
      //    FROM contact WHERE contact_id = ?`,
      //   [id?.toString()]
      // );
      const response = await prisma.contact.findMany({
        where: {
          contact_id: id?.toString(),
        },
      });
      res.status(200).json({ status: "success", data: response });
    } catch {
      res.status(200).json({ status: "error", message: "Invalid Token" });
    }
  }
);

router.post(
  "/api/contact/delete",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      const { contact_id }: any = fields;
      // await connection.query(
      //   `DELETE FROM contact WHERE contact_id = ${contact_id.toString()}`
      // );
      await prisma.contact.delete({
        where: {
          contact_id: parseInt(contact_id.toString()),
        },
      });
      res.status(200).json({ status: "success" });
    });
  }
);

router.post(
  "/api/contact/deleteall",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      const { contact_id }: any = fields;
      let id = contact_id.toString();
      // await connection.query(`DELETE FROM contact WHERE contact_id IN (${id})`);
      await prisma.$queryRawUnsafe(
        `DELETE FROM contact WHERE contact_id IN (${id})`
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
