# Reflection

## 1. Persistence consultation

I asked Claude Code which persistence mechanism would be most appropriate for a single-user document application with no backend. The options discussed included `localStorage`, `sessionStorage`, `IndexedDB`, cookies, and the File System Access API.

Claude recommended `localStorage` because the application stores a relatively small amount of data, has only one user, and does not require server-side storage or synchronisation. `sessionStorage` was rejected because data would be lost when the browser tab closes. `IndexedDB` would provide more capacity and flexibility but would add complexity that was not justified for this project. Cookies were unsuitable because of their small size limits and intended use for server communication.

I selected `localStorage` because it provided persistent storage across browser sessions with the simplest implementation and no additional dependencies.

---

## 2. Search → Paste → Cite example

While implementing the application, I consulted the Next.js documentation about layouts, pages, and dynamic routes.

I searched the official documentation, created a reference document in the `docs/` folder, and included the source URL at the top of the file. When discussing routing with Claude, I could refer to the documented behaviour rather than relying on assumptions.

Without this search → paste → cite workflow, Claude might have produced a solution that worked but did not follow the intended App Router conventions used by Next.js.

---

## 3. CLAUDE.md preventing agent drift

One example occurred during the implementation of the Document History optional task.

Claude initially proposed creating document history snapshots every two seconds after typing stopped. While technically correct, this would have created too many history entries during normal writing.

The rules in `CLAUDE.md` emphasised keeping solutions simple, practical, and aligned with the project's goals. After reviewing the proposal, I asked Claude to change the debounce period from two seconds to thirty seconds so that history entries would represent meaningful document states rather than every short pause in typing.

This produced a more practical solution while still satisfying the project requirements.

---

## 4. Design pass

I spent approximately 30–60 minutes refining the interface beyond the default scaffold.

Rather than using a vague prompt such as "make it look better", I provided specific design direction focused on:

- Clean workspace-style layout
- Comfortable typography
- Improved spacing and visual hierarchy
- Reduced clutter
- Consistent component styling
- Clear document navigation
- Responsive mobile behaviour

Compared with the initial scaffold, the final version feels more structured and easier to use, particularly on smaller screens. Several iterations were reviewed before selecting the final layout.

---

## 5. One thing that was harder than expected

The most difficult concept compared with the earlier HTML project was understanding document-specific routes.

In the HTML version everything existed on a single page. In Next.js, each document required its own URL such as `/docs/abc123`. I had to understand how dynamic routes work, how document IDs are passed through the URL, and how pages are loaded directly after refresh.

This required a different way of thinking compared with traditional single-page HTML applications.

---

## 6. What I would keep or change in the docs folder

The most useful documentation was the material directly related to layouts, pages, and routing because those concepts were immediately applicable to the project.

The least useful information was documentation describing more advanced routing patterns that were not needed for this application.

In future projects I would continue maintaining a `docs/` folder, but I would keep the notes shorter and focused on the specific topics that are actively being used in the current sprint. This would make the documentation easier to review and more valuable as a project reference.