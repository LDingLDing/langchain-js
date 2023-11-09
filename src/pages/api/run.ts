import { NextApiRequest, NextApiResponse } from "next";

import func from "@Exp/02_01";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const text = await func();
  return res.status(200).json({ code: 0, data: text });
}
