"use client";

import { useParams } from "next/navigation";
import { useDocs } from "../components/DocsProvider";

export default function DocPage() {
  const { id } = useParams<{ id: string }>();
  const { docs, initialized, updateDoc } = useDocs();

  if (!initialized) return null;

  const doc = docs.find((d) => d.id === id);

  if (!doc) {
    return (
      <main className="flex flex-1 items-center justify-center text-zinc-400">
        <p className="text-sm">Document not found</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col p-8 gap-4 overflow-y-auto bg-white">
      <input
        type="text"
        value={doc.title}
        onChange={(e) => updateDoc(id, { title: e.target.value })}
        className="text-2xl font-semibold text-[#111] bg-white border-none outline-none w-full placeholder:text-zinc-300"
        placeholder="Untitled"
      />
      <textarea
        value={doc.body}
        onChange={(e) => updateDoc(id, { body: e.target.value })}
        className="flex-1 resize-none text-sm text-[#111] bg-white border-none outline-none leading-relaxed placeholder:text-zinc-300"
        placeholder="Start writing…"
      />
    </main>
  );
}
