"use client";

import { useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDocs, type Doc } from "./DocsProvider";

type WorkspaceExport = {
  version: number;
  exportedAt: string;
  docs: unknown[];
};

function isValidWorkspaceExport(data: unknown): data is WorkspaceExport {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  if (typeof obj.version !== "number") return false;
  if (!Array.isArray(obj.docs)) return false;
  return obj.docs.every(
    (d) =>
      d !== null &&
      typeof d === "object" &&
      typeof (d as any).id === "string" &&
      typeof (d as any).title === "string" &&
      typeof (d as any).body === "string" &&
      typeof (d as any).updatedAt === "string"
  );
}

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { docs, createDoc, deleteDoc, importDocs } = useDocs();
  const [query, setQuery] = useState("");
  const [importError, setImportError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  function handleExport() {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      docs,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workspace-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (!isValidWorkspaceExport(data)) {
          setImportError("Invalid file. Please select a valid workspace export.");
          return;
        }
        const imported: Doc[] = (data.docs as any[]).map((d) => ({
          ...d,
          updatedAt: new Date(d.updatedAt),
        }));
        importDocs(imported);
        setImportError("");
        router.push("/docs");
      } catch {
        setImportError("Could not read the file. Make sure it is valid JSON.");
      }
      // Reset so the same file can be re-imported if needed
      e.target.value = "";
    };
    reader.readAsText(file);
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

      <div className="border-t border-zinc-200 p-3 space-y-2">
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex-1 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100"
          >
            Export
          </button>
          <button
            onClick={() => { setImportError(""); fileInputRef.current?.click(); }}
            className="flex-1 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100"
          >
            Import
          </button>
        </div>
        {importError && (
          <p className="text-xs text-red-500">{importError}</p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImportFile}
          className="hidden"
        />
      </div>
    </aside>
  );
}
