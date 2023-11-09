import React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useRouter } from "next/router";

import styles from "./index.module.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { read } from "fs";

export default function Page() {
  const router = useRouter();
  const [currentFile, setCurrentFile] = useState<string>("");
  const [editorRef, setEditorRef] =
    useState<editor.IStandaloneCodeEditor | null>();

  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    setEditorRef(editor);
  };

  const renderCode = useCallback(
    async (file: string) => {
      const response = await fetch(`/api/example/code?file=${file}`);
      const { data, code, msg } = await response.json();
      if (code) {
        alert(msg);
        return;
      }
      editorRef?.setValue(data);
    },
    [editorRef]
  );

  useEffect(() => {
    const currentFile = router.query.file as string;
    if (!currentFile || !editorRef) return;
    setCurrentFile(currentFile);
    renderCode(currentFile);
  }, [router, editorRef, renderCode]);

  return (
    <div className="flex h-full text-sm pb-8 pt-4">
      <div className="flex-none w-2/4 pl-8">
        <Card className="h-full w-full">
          <Editor
            defaultLanguage="typescript"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollbar: { vertical: "hidden", horizontal: "hidden" },
              overviewRulerBorder: false,
            }}
            onMount={handleEditorDidMount}
          />
        </Card>
      </div>
      <div className="flex-none w-2/4 px-8">
        <Card>
          <CardHeader>
            <CardDescription>代码说明：</CardDescription>基础调用模型示例
          </CardHeader>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardDescription>输出：</CardDescription>
            <p>请给我写一句情人节红玫瑰的中文宣传语</p>
            <p>请给我写一句情人节红玫瑰的中文宣传语</p>
            <p>请给我写一句情人节红玫瑰的中文宣传语</p>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
