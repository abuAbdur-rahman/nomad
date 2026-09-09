# AGENTS.md — Nomad IDE

## Project Overview

Nomad is a mobile-first **Android-only** IDE. V1 (MVP) is a self-contained Mini IDE with Monaco editor, file tree, git, and search. V2 adds Termux integration via a WebSocket bridge pattern.

---

## Build Commands (Bun)

```bash
# Install dependencies
bun install

# Development server
bun run dev

# Generate Android native project
npx expo prebuild --platform android --clean

# Build debug APK (requires Java 17)
cd android && ./gradlew assembleDebug

# Type check (no emit)
bunx tsc --noEmit
```

---

## Platform

- **Android only** — minimum SDK 26 (Android 8.0 Oreo)
- Bare Expo workflow
- No iOS, no web target

---

## Styling: NativeWind

This project uses **NativeWind** (Tailwind CSS for React Native). See: https://www.nativewind.dev

### Key Points

- Use `className` prop instead of `style` for most styling
- Custom colors defined in `tailwind.config.js`:
  - `bg-dark-100` → `#1a1a2e` (main background)
  - `bg-dark-200` → `#252542` (cards/headers)
  - `bg-dark-300` → `#2a2a4a` (borders)
  - `bg-dark-400` → `#3a3a5a` (buttons)
  - `primary` → `#6366f1` (accent)
  - `accent-yellow` → `#fbbf24`
- All components use NativeWind classes - no StyleSheet
- Global CSS file: `global.css` with `@tailwind` directives

### Tailwind Config
```javascript
// tailwind.config.js
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        dark: {
          100: '#1a1a2e',
          200: '#252542',
          300: '#2a2a4a',
          400: '#3a3a5a',
          500: '#4a4a6a',
        },
        accent: { yellow: '#fbbf24', green: '#50fa7b' }
      },
    },
  },
}
```

---

## Architecture Notes

### V1 Mini IDE (self-contained)
- Expo app (bare workflow)
- Monaco Editor via WebView (browser build)
- `isomorphic-git` in WebView for git operations (browser build, no polyfills)
- File tree via `expo-file-system` + SAF (Storage Access Framework)
- Search via `fuse.js` (runs in RN)

### Bridge Pattern (V2 only)
Node.js-native modules (ssh2, node-pty, ripgrep) run in Termux, NOT in React Native. React Native only needs `ws` (WebSocket client). This avoids Metro polyfill hell.

**Do not add Node.js polyfills to Metro.** The bridge pattern exists specifically to avoid this.

---

## Navigation

```
Splash (index.tsx)
    └──→ Dashboard           (Stack screen)
              └──→ IDE Shell  (Tab navigator)
                      ├── Editor   (default tab)
                      ├── Search
                      ├── Git
                      └── Settings
```

- File tree is a **slide-in overlay**, not a tab
- Android hardware back button handled at root layout level

---

## Directory Structure

```
nomad/
├── app/                     # expo-router routes
│   ├── _layout.tsx          # Root Stack, handles back button
│   ├── index.tsx            # Splash/boot
│   ├── dashboard.tsx        # Project picker
│   ├── (ide)/               # Tab group
│   │   ├── _layout.tsx      # Tabs + FileTreeOverlay
│   │   ├── editor.tsx
│   │   ├── search.tsx
│   │   ├── git.tsx
│   │   └── settings/
├── src/
│   ├── components/
│   │   ├── editor/          # MonacoEditor, EditorTabs, ExtraKeyToolbar
│   │   ├── filetree/        # FileTreeOverlay, FileNode, FileContextMenu
│   │   ├── git/             # GitPanel, ChangesList, CommitInput
│   │   └── ui/              # BottomSheet, TopBar, Toast
│   ├── services/
│   │   ├── fs/              # local.ts, saf.ts
│   │   ├── git/             # isogit.ts
│   │   └── search/          # local.ts (fuse.js)
│   ├── stores/              # Zustand (editor, filetree, git, project, settings)
│   └── hooks/               # useEditor, useFileTree, useGit, useKeyboard, useBackHandler
└── packages/bridge/         # @nomad/bridge (Termux Node.js) — V2
```

---

## Key Constraints

1. **NativeWind styling** — Use `className`, not `StyleSheet`
2. **WebView for Monaco** — not native RN; `postMessage` is the only bridge
3. **Browser build isomorphic-git** — no Node.js polyfills, runs inside WebView
4. **Local files only** — app sandbox + SAF-accessible directories
5. **HTTPS git auth only** — credentials in `expo-secure-store`; no SSH in V1
6. **No Node.js polyfills in Metro** — use bridge pattern instead
7. **V1 is offline-first** — no auth, no backend

---

## Tech Stack (V1)

| Component | Library |
|-----------|---------|
| Framework | Expo SDK 53 (bare workflow) |
| Styling | **NativeWind** (Tailwind CSS) |
| Navigation | expo-router v4 |
| Editor | Monaco (browser in WebView) |
| WebView | react-native-webview |
| Git | isomorphic-git |
| File system | expo-file-system + expo-document-picker (SAF) |
| Search | fuse.js |
| Storage | react-native-mmkv |
| State | Zustand |
| Gestures | react-native-gesture-handler |
| Animations | react-native-reanimated |
| Bottom sheets | @gorhom/bottom-sheet |
| Icons | @expo/vector-icons |
| Virtualized lists | @shopify/flash-list |

---

## V1 Features

- Splash/Boot with redirect logic
- Dashboard with recent projects
- Monaco editor (WebView)
- File tree overlay with swipe gesture
- Git panel (isomorphic-git)
- Search (fuse.js)
- Settings screen
- Extra key toolbar (above keyboard)

---

## V2+ Notes (deferred)

- Termux setup wizard, @nomad/bridge, SFTP, terminal, LSP, ripgrep, SSH