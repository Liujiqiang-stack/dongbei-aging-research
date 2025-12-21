import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import type { Language } from "../types";

type Props = {
  lang: Language;
  markdown: string;
};

const CommentaryView: React.FC<Props> = ({ lang, markdown }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-3xl font-black tracking-tight">新闻评论</h2>
          <p className="text-sm text-gray-500 mt-1">
            （内容来自本地 Markdown 文件，push 后自动上线）
          </p>
        </div>

        <span className="text-xs text-gray-400">
          {lang.toUpperCase()}
        </span>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <article className="prose prose-slate max-w-none prose-headings:scroll-mt-24">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]} // 允许 md 里写 <audio> <video> 等 HTML
          >
            {markdown}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
};

export default CommentaryView;

