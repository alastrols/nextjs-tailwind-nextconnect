import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma";
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
router.get(
  "/api/prisma/lists",
  async (req: NextApiRequest, res: NextApiResponse, next: any) => {
    // await prisma.user.create({
    //   data: {
    //     name: "Suphavit Bunnag 2",
    //   },
    // });
    try {
      // const users = await prisma.user.findUnique({
      //   where: {
      //     id: 1,
      //   },
      // });
      // const users = await prisma.user.findMany();
      const users = await prisma.user.findMany();
      res.status(200).json({ status: "success", data: users });
    } catch {
      res.status(200).json({ status: "error", message: "Invalid Token" });
    }
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
