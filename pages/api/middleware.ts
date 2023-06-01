import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { getCookies } from "cookies-next";
const { getToken, verifyToken } = require("@/jwtHandler");

export async function adminAuth(req: NextApiRequest, res: NextApiResponse) {
  return new Promise(async (resolve, reject) => {
    const accessToken = getCookies({ req, res })[
      `${process.env.ACCESS_TOKEN_KEY}`
    ];
    const decoded = await verifyToken(accessToken);
    if (decoded == "error") {
      res.json({ status: "error", message: "Invalid Token" });
      return;
    }
    resolve(decoded);
  });
}
