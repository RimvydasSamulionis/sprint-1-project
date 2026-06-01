import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-semibold tracking-tight">Docs</h1>
      <p className="max-w-sm text-center text-zinc-500">
        A personal document manager. Create, edit, and organise your documents
        — all stored locally in your browser.
      </p>
      <Link
        href="/docs"
        className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
      >
        Open Workspace
      </Link>
    </main>
  );
}
