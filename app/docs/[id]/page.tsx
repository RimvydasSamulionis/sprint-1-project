"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { useDocs } from "../components/DocsProvider";

export default function DocPage() {
  const { id } = useParams<{ id: string }>();
  const { docs, initialized, updateDoc } = useDocs();
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem("focusTitle") === id) {
      sessionStorage.removeItem("focusTitle");
      titleRef.current?.focus();
      titleRef.current?.select();
    }
  }, [id]);

  if (!initialized) return null;

  const doc = docs.find((d) => d.id === id);

  if (!doc) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 text-zinc-400">
        <p className="text-sm">Document not found</p>
        <Link
          href="/docs"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          Back to workspace
        </Link>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col overflow-y-auto bg-white">
      <div className="flex items-center border-b border-zinc-100 px-4 py-2 md:hidden">
        <Link href="/docs" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
          ← All documents
        </Link>
      </div>
      <div className="flex items-center justify-between border-b border-zinc-100 px-8 py-2">
        <input
          ref={titleRef}
          type="text"
          value={doc.title}
          onChange={(e) => updateDoc(id, { title: e.target.value })}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); bodyRef.current?.focus(); } }}
          className="text-2xl font-semibold text-[#111] bg-white border-none outline-none placeholder:text-zinc-300"
          placeholder="Untitled"
        />
        <div className="flex shrink-0 rounded-md border border-zinc-200 text-sm overflow-hidden">
          <button
            onClick={() => setMode("edit")}
            className={`px-3 py-1 transition-colors ${
              mode === "edit"
                ? "bg-zinc-900 text-white"
                : "text-zinc-500 hover:bg-zinc-100"
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setMode("preview")}
            className={`px-3 py-1 transition-colors ${
              mode === "preview"
                ? "bg-zinc-900 text-white"
                : "text-zinc-500 hover:bg-zinc-100"
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-8 pt-6">
        {mode === "edit" ? (
          <textarea
            ref={bodyRef}
            value={doc.body}
            onChange={(e) => updateDoc(id, { body: e.target.value })}
            className="flex-1 resize-none text-sm text-[#111] bg-white border-none outline-none leading-relaxed placeholder:text-zinc-300"
            placeholder="Start writing…"
          />
        ) : (
          <div className="markdown">
            {doc.body.trim() ? (
              <ReactMarkdown>{doc.body}</ReactMarkdown>
            ) : (
              <p className="text-zinc-300">Nothing to preview yet.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
