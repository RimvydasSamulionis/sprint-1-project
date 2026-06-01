"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Doc = {
  id: string;
  title: string;
  body: string;
  updatedAt: Date;
};

type DocsContextValue = {
  docs: Doc[];
  initialized: boolean;
  createDoc: () => Doc;
  updateDoc: (id: string, changes: Partial<Pick<Doc, "title" | "body">>) => void;
};

const DocsContext = createContext<DocsContextValue | null>(null);

const STORAGE_KEY = "docs";

function loadDocs(): Doc[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw).map((d: any) => ({ ...d, updatedAt: new Date(d.updatedAt) }));
  } catch {
    return [];
  }
}

function saveDocs(docs: Doc[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

export function DocsProvider({ children }: { children: ReactNode }) {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setDocs(loadDocs());
    setInitialized(true);
  }, []);

  function createDoc(): Doc {
    const newDoc: Doc = {
      id: crypto.randomUUID(),
      title: "Untitled",
      body: "",
      updatedAt: new Date(),
    };
    const updated = [...docs, newDoc];
    setDocs(updated);
    saveDocs(updated);
    return newDoc;
  }

  function updateDoc(id: string, changes: Partial<Pick<Doc, "title" | "body">>) {
    const updated = docs.map((doc) =>
      doc.id === id ? { ...doc, ...changes, updatedAt: new Date() } : doc
    );
    setDocs(updated);
    saveDocs(updated);
  }

  return (
    <DocsContext.Provider value={{ docs, initialized, createDoc, updateDoc }}>
      {children}
    </DocsContext.Provider>
  );
}

export function useDocs() {
  const ctx = useContext(DocsContext);
  if (!ctx) throw new Error("useDocs must be used inside DocsProvider");
  return ctx;
}
