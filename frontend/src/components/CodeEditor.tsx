import { Box, Stack } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import { useState, useRef } from "react";
import type * as monaco from "monaco-editor";
import LanguageSelector from "./LanguageSelector";

const CodeEditor = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");

  const onMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleLanguageChange = (lang: string) => {
    const langMap: Record<string, string> = {
      javascript: "javascript",
      C: "c",
      "C++": "cpp",
      Java: "java",
      Python: "python",
    };
    setLanguage(langMap[lang] || "javascript");
  };

  return (
    <Box>
      <Stack direction="row" gap={4}>
        <Box w="50%">
          <LanguageSelector onSelect={handleLanguageChange} />
          <Editor
            height="75vh"
            theme="vs-dark"
            language={language}
            value={value}
            onMount={onMount}
            onChange={(value) => setValue(value ?? "")}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default CodeEditor;
