import { useState } from "react";
import { Editor } from "@monaco-editor/react";

const languageMap: Record<string, number> = {
  javascript: 63,
  python: 71,
  cpp: 54,
  java: 62,
  typescript: 74,
};

const CodeEditor = ({
  code,
  setCode,
  setLanguageId,
}: {
  code: string;
  setCode: (value: string) => void;
  languageId: number;
  setLanguageId: (value: number) => void;
}) => {
  const [language, setLanguage] = useState("javascript");

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    setLanguageId(languageMap[selectedLanguage]);
  };

  return (
    <div className="h-[50vh] min-h-[300px] w-full border border-gray-700 md:h-[70vh] flex flex-col">
      <div className="p-2 bg-gray-800 text-white flex justify-between items-center">
        <label className="text-sm">Language:</label>
        <select
          className="bg-gray-700 text-white p-1 rounded"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="typescript">TypeScript</option>
        </select>
      </div>

      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          defaultValue={code}
          theme="vs-dark"
          onChange={(value) => setCode(value || "")}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
