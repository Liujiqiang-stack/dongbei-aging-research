import React from "react";
import { Language } from "../types";

type Props = {
  lang: Language;
  markdown: string;
};

export default function CommentaryView({ lang, markdown }: Props) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-black text-gray-900">
          {lang === "zh" ? "新闻评论" : "Kommentar"}
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          {lang === "zh"
            ? "（内容来自本地 Markdown 文件，push 后自动上线）"
            : "(Inhalt aus lokaler Markdown-Datei, wird nach Push automatisch veröffentlicht)"}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="whitespace-pre-wrap leading-7 text-gray-800">
          {markdown}
        </div>
      </div>
    </div>
  );
}
