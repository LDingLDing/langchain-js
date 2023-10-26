import { getCode } from "@/controllers/examples";
import { NextApiRequest, NextApiResponse } from "next";

type GetQuery = {
  file: string;
};

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { file } = (req.query ?? {}) as GetQuery;
  if (!file) {
    return { code: 1001, msg: "file is required" };
  }
  try {
    const data = await getCode(file);
    return res.status(200).json({ code: 0, data });
  } catch (e) {
    e = typeof e === "object" ? JSON.stringify(e) : e;
    return res.status(200).json({ code: 1002, msg: e });
  }
}
