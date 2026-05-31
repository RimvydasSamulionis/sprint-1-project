# Persistence Decision

## Selected approach: `localStorage`

Documents are serialised to JSON and stored in `localStorage` under a single key. On app load, the stored value is parsed and hydrated into state. No backend, no build step, no user gesture required.

## Alternatives considered

| Option | Reason rejected |
|---|---|
| `sessionStorage` | Clears when the tab closes — no persistence between sessions |
| `IndexedDB` | Async, complex API; designed for large or structured datasets. Overkill for a single-user localhost app |
| Cookies | 4 KB limit; designed for server communication, not client storage |
| File System Access API | Requires a user file-picker gesture each session — not seamless |

## Why `localStorage`

- Synchronous and simple — no async handling needed for read/write
- Persists across sessions and browser restarts
- ~5 MB limit per origin is sufficient for a single-user document app
- Zero dependencies, no configuration

## Upgrade path

If documents grow large or numerous, migrate to `IndexedDB` (e.g. via the `idb` wrapper). The switch is localised to the storage layer and does not affect the rest of the app.
