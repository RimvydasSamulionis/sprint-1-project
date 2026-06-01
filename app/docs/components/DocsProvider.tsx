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
  deleteDoc: (id: string) => void;
};

// crypto.randomUUID() requires a secure context (HTTPS/localhost).
// Accessing via a LAN IP over HTTP falls back to this UUID v4 generator.
function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

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
      id: generateId(),
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

  function deleteDoc(id: string) {
    const updated = docs.filter((doc) => doc.id !== id);
    setDocs(updated);
    saveDocs(updated);
  }

  return (
    <DocsContext.Provider value={{ docs, initialized, createDoc, updateDoc, deleteDoc }}>
      {children}
    </DocsContext.Provider>
  );
}

export function useDocs() {
  const ctx = useContext(DocsContext);
  if (!ctx) throw new Error("useDocs must be used inside DocsProvider");
  return ctx;
}
