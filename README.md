# Sprint 1 Project — Document Workspace

## Overview

This is a single-user, browser-based document management application built with Next.js. It allows a user to create, edit, organise, and preview Markdown documents entirely client-side, with no backend server or database required. The application is intended as a lightweight "workspace" for writing and managing personal notes or documents.

## Features Implemented

- **Create documents** — add new documents to the workspace from the sidebar
- **Edit documents** — update document title and content with live editing
- **Delete documents** — remove documents from the workspace
- **Markdown preview** — toggle between raw Markdown editing and a rendered preview
- **Persistent storage** — documents persist across browser sessions via `localStorage`
- **Responsive layout** — usable workspace experience on both desktop and mobile screens

## Optional Tasks Completed

- **Export / Import Workspace** — the entire workspace (all documents) can be exported to a file and re-imported later, allowing backup and transfer between browsers/devices
- **Document History** — each document keeps up to 3 previous versions, with the ability to restore any of them

## Technology Stack

- [Next.js](https://nextjs.org) (App Router)
- [TypeScript](https://www.typescriptlang.org)
- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- `localStorage` (browser-based persistence)

## Installation

```bash
git clone <repository-url>
cd sprint-1-project
npm install
```

## Running Locally

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser. The app auto-reloads as files are edited.

## Project Structure

```
app/
├── page.tsx                  # Landing / home page
├── layout.tsx                # Root layout
├── globals.css                # Global styles (Tailwind)
└── docs/
    ├── page.tsx               # Workspace overview page
    ├── layout.tsx              # Workspace layout (sidebar + content)
    ├── [id]/
    │   └── page.tsx            # Individual document route (edit/preview)
    └── components/
        ├── DocsProvider.tsx     # Document state, persistence, history, export/import logic
        └── Sidebar.tsx           # Document navigation sidebar
docs/
└── nextjs-layouts-and-pages.md  # Reference notes on Next.js routing, used during development
public/                            # Static assets
```

## Screenshots

> Screenshots have not yet been added. Once available, place image files in `docs/screenshots/` and reference them below.

![Workspace screenshot placeholder](docs/screenshots/workspace.png)

## Persistence Decision Summary

The application uses `localStorage` for persistence. This decision was made because the app is single-user and has no backend: there is no need for server-side storage, multi-device sync, or the larger capacity offered by `IndexedDB`. `sessionStorage` was ruled out because it would not persist data across browser sessions, and cookies are unsuitable due to size limits and their server-communication purpose. `localStorage` gives persistent, dependency-free storage that is well matched to the relatively small amount of data this application manages. See [REFLECTION.md](REFLECTION.md) for the full reasoning.

## Git Workflow Summary

Development followed a **feature → review → implementation → PR** workflow:

1. Each feature (e.g. Markdown preview, Export/Import, Document History) was scoped and planned before coding began.
2. Proposed approaches were reviewed for simplicity and fit with project goals before implementation.
3. Features were implemented on dedicated branches.
4. Completed work was opened as a pull request and merged into the main branch after review.

This is reflected in the repository's commit and PR history, including dedicated branches for optional tasks.

## Future Improvements

- Migrate to `IndexedDB` if document volume or size grows beyond what `localStorage` comfortably supports
- Add full-text search across documents
- Add tagging/categorisation for easier document organisation
- Add a "trash"/undo mechanism for deleted documents
- Add automated tests for document persistence and history logic
