# Reflection

## Project Approach

This project was built using Claude Code as a development assistant rather than as a fully autonomous code generator.

Instead of describing the entire application and asking for a complete implementation, I worked feature-by-feature:

1. Define a single feature.
2. Ask Claude for an implementation plan.
3. Review the proposed architecture.
4. Approve or adjust the approach.
5. Implement the feature.
6. Test locally.
7. Commit, push, create a Pull Request, and review the diff.

This approach produced smaller, easier-to-review changes and reduced debugging time compared to generating large amounts of code at once.

The most valuable lesson from this project was learning that AI-assisted development works best when features are implemented incrementally rather than attempting to build an entire application in a single prompt.

---

# Persistence Decision

## Selected approach: localStorage

Documents are serialised to JSON and stored in localStorage under a single key. On application load, the stored value is parsed and hydrated into application state.

No backend, database, authentication system, or user interaction is required for persistence.

## Alternatives considered

| Option | Reason rejected |
|----------|----------|
| sessionStorage | Data is lost when the browser tab closes |
| IndexedDB | More complex than required for a small single-user application |
| Cookies | Limited storage capacity and designed primarily for server communication |
| File System Access API | Requires repeated user interaction through file pickers |

## Why localStorage

- Simple implementation
- Synchronous API
- No backend required
- Persists across browser sessions
- Sufficient capacity for a single-user document application
- No additional dependencies

## Upgrade Path

If document volume grows significantly, IndexedDB would be the next logical step because it is designed for larger client-side datasets and more advanced querying.

---

# Design Process

Approximately 30–60 minutes were spent refining the interface beyond the default scaffold.

Rather than asking Claude to "make it prettier", I provided specific design direction:

- Clean workspace-inspired layout
- Comfortable typography and spacing
- Reduced visual clutter
- Clear document hierarchy
- Consistent component styling
- Readable empty states
- Responsive mobile experience

Several iterations were reviewed before selecting the final design.

---

# Behaviour-First Prompting

Pages and routes were described using user behaviour rather than framework implementation details.

Examples:

- The application should have a home page introducing the product.
- Users should see a workspace containing all documents.
- Each document should have its own URL such as `/docs/abc123`.
- Refreshing the page should preserve user data.
- Users should be able to return to the workspace from an individual document.

This allowed Claude to choose the appropriate Next.js implementation while keeping discussions focused on user experience and functionality.

---

# Git and Development Workflow

Development followed a feature-based workflow:

Feature → Plan → Review → Implement → Test → Commit → Pull Request → Merge

Each optional feature was developed in its own branch, reviewed through a Pull Request, and merged only after testing.

This process made it easier to understand changes, review diffs, and identify issues early.

---

# What I Learned

The most important lesson was that successful AI-assisted development depends more on problem definition and review than on code generation.

A clear feature description, implementation review, testing process, and Pull Request workflow consistently produced better results than requesting large-scale changes in a single prompt.

By the end of the project I was able to explain:

- Why localStorage was selected.
- What alternative persistence mechanisms were considered.
- How the Next.js routing structure supports document-specific URLs.
- How feature branches, Pull Requests, and code reviews fit into a professional development workflow.
- How to collaborate effectively with Claude Code using small, focused tasks.