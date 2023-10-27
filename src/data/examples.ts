export const exampleList = [
  { file: "00_01", name: "案例一", overview: "", descript: "" },
  { file: "00_02", name: "案例二", overview: "", descript: "" },
];
export function getExampleInfo(file: string) {
  return exampleList.find((item) => item.file === file);
}

export default exampleList;
