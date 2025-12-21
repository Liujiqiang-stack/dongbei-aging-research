import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Language } from "../types";

type Props = {
  lang: Language;
  markdown: string;
};

const TITLE: Record<Language, string> = {
  zh: "新闻评论",
  de: "Kommentar",
  ru: "Комментарий",
  en: "Commentary",
};

const NOTE: Record<Language, string> = {
  zh: "（内容来自本地 Markdown 文件，push 后自动上线）",
  de: "(Inhalt kommt aus einer lokalen Markdown-Datei; nach dem Push automatisch online.)",
  ru: "(Контент из локального Markdown-файла; после push автоматически публикуется.)",
  en: "(Content comes from a local Markdown file; auto-deploys after push.)",
};

export default function CommentaryView({ lang, markdown }: Props) {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-3xl font-black tracking-tight text-gray-900">
          {TITLE[lang] ?? "Commentary"}
        </h2>
        <p className="mt-2 text-sm text-gray-500">{NOTE[lang] ?? ""}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 mt-2 mb-4">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-3">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mt-6 mb-2">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-[15px] leading-7 text-gray-800 mb-4">
                {children}
              </p>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-300 bg-blue-50/50 rounded-r-xl px-4 py-3 my-4 text-gray-800">
                {children}
              </blockquote>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-6 my-4 space-y-2 text-gray-800">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-6 my-4 space-y-2 text-gray-800">
                {children}
              </ol>
            ),
            li: ({ children }) => <li className="leading-7">{children}</li>,
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 font-semibold underline underline-offset-2 hover:text-blue-700"
              >
                {children}
              </a>
            ),
            code: ({ children }) => (
              <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-900 text-[13px]">
                {children}
              </code>
            ),
            pre: ({ children }) => (
              <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 overflow-x-auto my-4 text-[13px] leading-6">
                {children}
              </pre>
            ),
            hr: () => <hr className="my-8 border-gray-200" />,
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
