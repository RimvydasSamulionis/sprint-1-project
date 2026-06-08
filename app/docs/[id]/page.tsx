"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { useDocs, type HistoryEntry } from "../components/DocsProvider";

type Mode = "edit" | "preview" | "history";

export default function DocPage() {
  const { id } = useParams<{ id: string }>();
  const { docs, initialized, updateDoc, snapshotDoc } = useDocs();
  const [mode, setMode] = useState<Mode>("edit");
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // Derive doc before effects so the debounce effect can reference it.
  const doc = docs.find((d) => d.id === id);

  // Auto-focus and select title text on new document creation.
  useEffect(() => {
    if (sessionStorage.getItem("focusTitle") === id) {
      sessionStorage.removeItem("focusTitle");
      titleRef.current?.focus();
      titleRef.current?.select();
    }
  }, [id]);

  // Debounced history snapshot: 2 seconds after the last content change.
  // Deduplication is handled inside snapshotDoc — identical consecutive
  // snapshots are never stored.
  useEffect(() => {
    if (!doc) return;
    const timer = setTimeout(() => snapshotDoc(id), 30000);
    return () => clearTimeout(timer);
  }, [doc?.title, doc?.body]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!initialized) return null;

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

  function handleRestore(entry: HistoryEntry) {
    if (!window.confirm("Restore this version? Your current content will be replaced.")) return;
    updateDoc(id, { title: entry.title, body: entry.body });
    setMode("edit");
    setSelectedEntry(null);
  }

  const tabClass = (m: Mode) =>
    `px-3 py-1 transition-colors ${
      mode === m ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-100"
    }`;

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
          <button onClick={() => setMode("edit")} className={tabClass("edit")}>Edit</button>
          <button onClick={() => setMode("preview")} className={tabClass("preview")}>Preview</button>
          <button onClick={() => setMode("history")} className={tabClass("history")}>History</button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-8 pt-6">
        {mode === "edit" && (
          <textarea
            ref={bodyRef}
            value={doc.body}
            onChange={(e) => updateDoc(id, { body: e.target.value })}
            className="flex-1 resize-none text-sm text-[#111] bg-white border-none outline-none leading-relaxed placeholder:text-zinc-300"
            placeholder="Start writing…"
          />
        )}

        {mode === "preview" && (
          <div className="markdown">
            {doc.body.trim() ? (
              <ReactMarkdown>{doc.body}</ReactMarkdown>
            ) : (
              <p className="text-zinc-300">Nothing to preview yet.</p>
            )}
          </div>
        )}

        {mode === "history" && (
          <div className="flex flex-col gap-6">
            {doc.history.length === 0 ? (
              <p className="text-sm text-zinc-400">
                No history yet. Keep writing to build up version history.
              </p>
            ) : (
              <>
                <div className="flex flex-col gap-1">
                  {doc.history.map((entry, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedEntry(selectedEntry === entry ? null : entry)}
                      className={`flex items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                        selectedEntry === entry
                          ? "bg-zinc-900 text-white"
                          : "text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      <span>{entry.savedAt.toLocaleString()}</span>
                      {selectedEntry === entry && (
                        <span className="text-xs opacity-60">selected</span>
                      )}
                    </button>
                  ))}
                </div>

                {selectedEntry ? (
                  <div className="flex flex-col gap-4 rounded-md border border-zinc-200 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xs text-zinc-400">
                        Saved {selectedEntry.savedAt.toLocaleString()}
                      </p>
                      <button
                        onClick={() => handleRestore(selectedEntry)}
                        className="shrink-0 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-700"
                      >
                        Restore this version
                      </button>
                    </div>
                    <div className="text-lg font-semibold text-[#111]">
                      {selectedEntry.title || <span className="text-zinc-300">Untitled</span>}
                    </div>
                    <div className="markdown text-sm">
                      {selectedEntry.body.trim() ? (
                        <ReactMarkdown>{selectedEntry.body}</ReactMarkdown>
                      ) : (
                        <span className="text-zinc-300">Empty document</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-400">Select a version above to preview it.</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
