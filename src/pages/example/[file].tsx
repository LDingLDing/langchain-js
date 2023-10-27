import { useCallback, useEffect, useRef, useState } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useRouter } from "next/router";

import styles from "./index.module.css";

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
    <main className={styles.main}>
      <div className={styles.editor}>
        <Editor
          height="500px"
          defaultLanguage="typescript"
          onMount={handleEditorDidMount}
        />
      </div>
    </main>
  );
}
