// lexical-editor.tsx
"use client";

import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { $getRoot, $insertNodes, type EditorState } from "lexical";
import { useEffect } from "react";
import { ToolbarPlugin } from "./toolbar-plugin";

// Plugin para toolbar

const theme = {
  paragraph: "mb-2",
  heading: {
    h1: "text-3xl font-bold mb-4",
    h2: "text-2xl font-bold mb-3",
    h3: "text-xl font-bold mb-2",
  },
  list: {
    ol: "list-decimal ml-4",
    ul: "list-disc ml-4",
  },
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
  },
  link: "text-blue-600 underline cursor-pointer",
};

function OnChangePluginWrapper({
  onChange,
}: {
  onChange: (html: string) => void;
}) {
  const [editor] = useLexicalComposerContext();

  const handleChange = (editorState: EditorState) => {
    editorState.read(() => {
      const html = $generateHtmlFromNodes(editor);
      onChange(html);
    });
  };

  return <OnChangePlugin onChange={handleChange} />;
}

function InitialValuePlugin({ value }: { value?: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (value && value !== "") {
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(value, "text/html");
        const nodes = $generateNodesFromDOM(editor, dom);
        const root = $getRoot();
        root.clear();
        root.select();
        $insertNodes(nodes);
      });
    }
  }, [editor, value]);

  return null;
}

interface LexicalEditorProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function LexicalEditor({
  value,
  onChange,
  placeholder,
}: LexicalEditorProps) {
  const initialConfig = {
    namespace: "ArticleEditor",
    theme,
    onError: (error: Error) => {
      console.error(error);
    },
    nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, LinkNode],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative border rounded-md w-full overflow-hidden">
        <ToolbarPlugin />
        <div className="relative w-full">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[200px] sm:min-h-[300px] max-h-[400px] sm:max-h-[500px] overflow-y-auto p-3 sm:p-4 outline-none w-full" />
            }
            placeholder={
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 text-gray-400 pointer-events-none text-sm sm:text-base">
                {placeholder || "Digite o conteúdo do artigo..."}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <OnChangePluginWrapper onChange={onChange} />
          <InitialValuePlugin value={value} />
        </div>
      </div>
    </LexicalComposer>
  );
}
