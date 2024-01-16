import { NextApiRequest, NextApiResponse } from "next";
import dynamic from "next/dynamic";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = JSON.parse(req.body);
  if (!code) {
    return res.status(200).json({ code: 1003, data: "code is required" });
  }

  // const code2 = 'export default function hello() { console.log("Hello"); }';
  // eval(code2);
  // const objectURL = URL.createObjectURL(
  //   new Blob([code2], { type: "text/javascript" })
  // );
  // const func = (await import(objectURL)).default;
  // console.log("#1", func);
  // func?.();

  // const func = await dynamic(() => import(`@Exp/${code}`));
  return res.status(200).json({ code: 0, data: {} });
}
