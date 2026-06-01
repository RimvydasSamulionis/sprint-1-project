"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDocs } from "./DocsProvider";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { docs, createDoc, deleteDoc } = useDocs();
  const [query, setQuery] = useState("");

  const filtered = docs
    .filter((doc) => doc.title.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  function handleNewDocument() {
    const newDoc = createDoc();
    sessionStorage.setItem("focusTitle", newDoc.id);
    router.push(`/docs/${newDoc.id}`);
  }

  function handleDelete(id: string) {
    if (!window.confirm("Delete this document? This cannot be undone.")) return;
    deleteDoc(id);
    if (pathname === `/docs/${id}`) router.push("/docs");
  }

  const isDocOpen = pathname.startsWith("/docs/");

  return (
    <aside className={`${isDocOpen ? "hidden md:flex" : "flex"} w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-zinc-200 bg-zinc-50 flex-col`}>
      <div className="p-3 border-b border-zinc-200 space-y-2">
        <button
          onClick={handleNewDocument}
          className="w-full rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          + New Document
        </button>
        <input
          type="search"
          placeholder="Search documents…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300"
        />
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {docs.length === 0 ? (
          <div className="px-2 py-6 text-center space-y-2">
            <p className="text-xs text-zinc-500">No documents yet.</p>
            <p className="text-xs text-zinc-400">Click &ldquo;+ New Document&rdquo; to get started.</p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="px-2 py-4 text-center text-xs text-zinc-400">
            No results for &ldquo;{query}&rdquo;
          </p>
        ) : (
          <ul className="space-y-0.5">
            {filtered.map((doc) => (
              <li key={doc.id} className="group flex items-center rounded-md hover:bg-zinc-100">
                <button
                  onClick={() => router.push(`/docs/${doc.id}`)}
                  className="flex-1 px-3 py-2 text-left text-sm text-zinc-700 truncate"
                >
                  {doc.title}
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  aria-label={`Delete ${doc.title}`}
                  className="mr-1 rounded p-1 text-zinc-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </aside>
  );
}
