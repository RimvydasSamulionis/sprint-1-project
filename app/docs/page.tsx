export default function DocsPage() {
  return (
    <div className="flex flex-1 h-full">
      <aside className="w-64 shrink-0 border-r border-zinc-200 bg-zinc-50 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
          Documents
        </p>
      </aside>
      <main className="flex flex-1 items-center justify-center text-zinc-400">
        <p className="text-sm">Select a document to get started</p>
      </main>
    </div>
  );
}
