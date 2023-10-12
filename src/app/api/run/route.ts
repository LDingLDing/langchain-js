/** @format */

import { NextApiRequest, NextApiResponse } from "next";

import func from "@Exp/01_02";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const text = await func();
  return Response.json({ data: text });
}