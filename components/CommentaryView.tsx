// components/CommentaryView.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Language } from "../types";

type Props = {
  lang: Language;
  markdown: string;
};

type TocItem = {
  id: string;
  text: string;
  level: 1 | 2 | 3;
};

function stripMdToPlain(md: string) {
  // very lightweight: remove fenced code, inline code, links/images, and markup
  let s = md.replace(/```[\s\S]*?```/g, " ");
  s = s.replace(/`[^`]*`/g, " ");
  s = s.replace(/!\[[^\]]*]\([^)]+\)/g, " ");
  s = s.replace(/\[[^\]]*]\([^)]+\)/g, " ");
  s = s.replace(/[#>*_~`-]/g, " ");
  return s;
}

function estimateReadingTime(md: string) {
  const plain = stripMdToPlain(md);

  const cjk = (plain.match(/[\u4E00-\u9FFF]/g) || []).length; // Chinese chars
  const words = (plain.match(/[A-Za-zА-Яа-яЁё]+/g) || []).length; // latin + cyrillic words

  // Speeds: ~500 CJK chars/min, ~220 words/min
  const minByCjk = cjk / 500;
  const minByWords = words / 220;

  const minutes = Math.max(1, Math.ceil(Math.max(minByCjk, minByWords)));
  return { minutes, words, cjk };
}

function slugBase(input: string) {
  const s = input
    .trim()
    .toLowerCase()
    .replace(/[`"'“”‘’]/g, "")
    .replace(/[^\p{L}\p{N}\u4E00-\u9FFF\s-]/gu, "") // keep letters/numbers/CJK
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return s || "section";
}

function parseToc(md: string) {
  const lines = md.split("\n");
  let inCode = false;

  const counts = new Map<string, number>();
  const makeId = (text: string) => {
    const base = slugBase(text);
    const n = (counts.get(base) || 0) + 1;
    counts.set(base, n);
    return n === 1 ? base : `${base}-${n}`;
  };

  const toc: TocItem[] = [];
  const idQueue: string[] = []; // heading ids in render order (h1-h3)

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;

    const m = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (!m) continue;

    const level = m[1].length as 1 | 2 | 3;
    const rawText = m[2].trim().replace(/\s+#*\s*$/, ""); // remove trailing ####
    if (!rawText) continue;

    const id = makeId(rawText);
    toc.push({ id, text: rawText, level });
    idQueue.push(id);
  }

  return { toc, idQueue };
}

const CommentaryView: React.FC<Props> = ({ lang, markdown }) => {
  // progress
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string>("");
  const [tocOpen, setTocOpen] = useState(false);

  const articleRef = useRef<HTMLDivElement | null>(null);
  const headingIdQueueRef = useRef<string[]>([]);

  const { toc, idQueue } = useMemo(() => parseToc(markdown), [markdown]);
  const reading = useMemo(() => estimateReadingTime(markdown), [markdown]);

  // keep queue in sync so headings get stable ids
  useEffect(() => {
    headingIdQueueRef.current = [...idQueue];
  }, [idQueue]);

  // reading progress
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollHeight = doc.scrollHeight || document.body.scrollHeight;
      const clientHeight = doc.clientHeight || window.innerHeight;
      const denom = Math.max(1, scrollHeight - clientHeight);
      setProgress(Math.max(0, Math.min(1, scrollTop / denom)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // active heading highlight (IntersectionObserver)
  useEffect(() => {
    if (!toc.length) return;

    const headings = toc
      .map((x) => document.getElementById(x.id))
      .filter(Boolean) as HTMLElement[];

    if (!headings.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        // choose the entry closest to top that is intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top ?? 0) - (b.boundingClientRect.top ?? 0));
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: "-15% 0px -70% 0px", // “near top” becomes active
      }
    );

    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [toc]);

  const title =
    lang === "zh"
      ? "新闻评论"
      : lang === "de"
      ? "Kommentar"
      : lang === "ru"
      ? "Комментарий"
      : "Commentary";

  const jumpTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    setTocOpen(false);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <div className="space-y-6">
      {/* ✅ 阅读进度条（固定顶部） */}
      <div className="sticky top-[72px] z-20">
        <div className="h-1 w-full bg-slate-200/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-[width] duration-150"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
          <span className="font-bold">
            {lang === "zh" ? "阅读进度" : lang === "de" ? "Lesefortschritt" : "Progress"}：{" "}
            {Math.round(progress * 100)}%
          </span>
          <span className="font-bold">
            {lang === "zh"
              ? `预计 ${reading.minutes} 分钟读完`
              : lang === "de"
              ? `≈ ${reading.minutes} Min.`
              : `≈ ${reading.minutes} min`}
          </span>
        </div>
      </div>

      {/* 标题卡 */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900">{title}</h2>
            <p className="text-sm text-slate-400 mt-2">
              {lang === "zh"
                ? "（文章来自本地 Markdown，push 后自动上线）"
                : lang === "de"
                ? "(Inhalt aus Markdown, auto-deploy nach Push)"
                : "(Markdown content, auto-deploy after push)"}
            </p>
          </div>

          {/* ✅ 移动端目录按钮 */}
          {toc.length > 0 && (
            <button
              onClick={() => setTocOpen((v) => !v)}
              className="md:hidden px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-sm"
            >
              {lang === "zh" ? "目录" : lang === "de" ? "Inhalt" : "TOC"}
            </button>
          )}
        </div>

        {/* 移动端目录面板 */}
        {tocOpen && toc.length > 0 && (
          <div className="md:hidden mt-4 rounded-2xl border border-slate-100 bg-white p-4">
            <div className="text-xs font-black text-slate-500 mb-2">
              {lang === "zh" ? "章节导航" : lang === "de" ? "Navigation" : "Navigation"}
            </div>
            <div className="space-y-1">
              {toc.map((item) => (
                <button
                  key={item.id}
                  onClick={() => jumpTo(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition ${
                    activeId === item.id ? "bg-blue-50 text-blue-700" : "hover:bg-slate-100 text-slate-700"
                  }`}
                  style={{ paddingLeft: 12 + (item.level - 1) * 14 }}
                >
                  {item.text}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ✅ 左侧 TOC + 右侧正文 */}
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        {/* 左侧目录（桌面端） */}
        <aside className="hidden md:block">
          <div className="sticky top-[140px] bg-white rounded-3xl border border-slate-100 shadow-xl p-6">
            <div className="text-xs font-black text-slate-500 mb-3">
              {lang === "zh" ? "目录" : lang === "de" ? "INHALT" : "TOC"}
            </div>
            <div className="max-h-[70vh] overflow-auto pr-2 space-y-1">
              {toc.length === 0 ? (
                <div className="text-sm text-slate-400">
                  {lang === "zh" ? "未检测到标题（请在 Markdown 用 # / ## / ###）" : "No headings found"}
                </div>
              ) : (
                toc.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => jumpTo(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition ${
                      activeId === item.id ? "bg-blue-50 text-blue-700" : "hover:bg-slate-100 text-slate-700"
                    }`}
                    style={{ paddingLeft: 12 + (item.level - 1) * 14 }}
                    title={item.text}
                  >
                    <span className="line-clamp-2">{item.text}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* 正文 */}
        <section
          ref={articleRef}
          className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children, ...props }) => {
                const id = headingIdQueueRef.current.shift() || "section";
                return (
                  <h1 id={id} className="text-3xl font-black mt-2 mb-4 scroll-mt-28" {...props}>
                    {children}
                  </h1>
                );
              },
              h2: ({ children, ...props }) => {
                const id = headingIdQueueRef.current.shift() || "section";
                return (
                  <h2 id={id} className="text-2xl font-black mt-10 mb-3 scroll-mt-28" {...props}>
                    {children}
                  </h2>
                );
              },
              h3: ({ children, ...props }) => {
                const id = headingIdQueueRef.current.shift() || "section";
                return (
                  <h3 id={id} className="text-xl font-black mt-8 mb-2 scroll-mt-28" {...props}>
                    {children}
                  </h3>
                );
              },
              p: ({ children, ...props }) => (
                <p className="text-slate-700 leading-8 my-4" {...props}>
                  {children}
                </p>
              ),
              li: ({ children, ...props }) => (
                <li className="ml-5 list-disc leading-8" {...props}>
                  {children}
                </li>
              ),
              blockquote: ({ children, ...props }) => (
                <blockquote className="border-l-4 border-blue-200 pl-4 text-slate-600 italic my-4" {...props}>
                  {children}
                </blockquote>
              ),
              code: ({ children, ...props }) => (
                <code className="px-1 py-0.5 rounded bg-slate-100 text-slate-900" {...props}>
                  {children}
                </code>
              ),
              pre: ({ children, ...props }) => (
                <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 overflow-auto my-6" {...props}>
                  {children}
                </pre>
              ),
              img: ({ ...props }) => (
                <img
                  {...props}
                  className="my-6 rounded-2xl border border-slate-100 shadow-sm max-w-full"
                  loading="lazy"
                />
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </section>
      </div>
    </div>
  );
};

export default CommentaryView;

