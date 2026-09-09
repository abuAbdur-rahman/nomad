# Nomad V1 — MVP Plan

## Goal
Ship a self-contained Mini IDE for Android. Works offline. No auth, no backend.
Validate editor UX and mobile-first navigation.

## Platform
**Android only.** Minimum SDK 26 (Android 8.0 Oreo — covers ~97% of active devices).
No iOS target. No web target. Bare Expo workflow.

---

## Styling: NativeWind

This project uses **NativeWind** (Tailwind CSS for React Native).

- **Documentation**: https://www.nativewind.dev
- Use `className` prop instead of `style` for all styling
- Custom colors defined in `tailwind.config.js`:
  - `bg-dark-100` → `#1a1a2e` (main background)
  - `bg-dark-200` → `#252542` (cards/headers)
  - `bg-dark-300` → `#2a2a4a` (borders)
  - `bg-dark-400` → `#3a3a5a` (buttons)
  - `primary` → `#6366f1` (accent)
  - `accent-yellow` → `#fbbf24`
- Import global CSS in root layout: `import '../global.css'`

---

## Navigation Model

### Flow Overview
```
Splash (index.tsx)
    └──→ Dashboard           (Stack screen — project picker)
              └──→ IDE Shell (Tab navigator — main experience)
                      ├── Tab 1: Editor   📝  (default tab)
                      ├── Tab 2: Search   🔍
                      ├── Tab 3: Git      🔀
                      └── Tab 4: Settings ⚙️
```

### File Tree
The file tree is **not a tab**. It is a slide-in overlay triggered by the hamburger
icon (top-left) or a right-edge swipe gesture. It sits on top of any active tab.

---

## V1 Features

- **Splash/Boot** — Logo + wordmark, check for saved project, redirect to Dashboard
- **Dashboard** — Recent projects grid, New / Clone / Open actions, project deletion
- **Monaco Editor** — WebView browser build, syntax highlighting, file tabs, breadcrumb, extra key toolbar
- **File Tree** — Slide-in overlay, expo-file-system + SAF, expand/collapse, context menu
- **Git** — isomorphic-git (browser build in WebView), clone / commit / push / pull / branch switch, HTTPS auth only, diff viewer
- **Search** — fuse.js fuzzy + regex, runs in RN, replace support
- **Settings** — Theme, font, font size, tab size, word wrap, minimap, toolbar config, about
- **Extra Key Toolbar** — Two-row symbol bar above the soft keyboard
- **Android Back Button** — Handled at root layout level; closes overlays before popping screens

---

## Tech Stack

| Component | Library | Notes |
|---|---|---|
| Framework | Expo SDK 53 (bare workflow) | Android-only |
| **Styling** | **NativeWind** | Tailwind CSS for RN |
| Navigation | expo-router v4 | File-based, tabs + stack |
| Editor | Monaco Editor | Browser build inside WebView |
| WebView | react-native-webview | postMessage bridge |
| Git | isomorphic-git | Browser build, no polyfills |
| File system | expo-file-system | App sandbox + SAF |
| SAF picker | expo-document-picker | External folder access |
| Search | fuse.js | Pure JS, runs in RN thread |
| Persistent KV | react-native-mmkv | Settings, recent projects |
| State | zustand + MMKV adapter | No Context boilerplate |
| Gestures | react-native-gesture-handler | Swipe for file tree |
| Animations | react-native-reanimated | Slide-in / sheet panels |
| Bottom sheets | @gorhom/bottom-sheet | Git sub-panels, context menus |
| Icons | @expo/vector-icons | MaterialCommunityIcons |
| Toasts | react-native-toast-message | Error / success feedback |
| Fast lists | @shopify/flash-list | File tree, search results, commits |

---

## Not in V1

- No auth (Supabase is V4)
- No Termux bridge (V2)
- No terminal / PTY (V2)
- No LSP / intellisense (V2)
- No SFTP (local files only)
- No ripgrep (fuse.js only)
- No cloud tier (V3)

---

## File Structure

```
nomad/
├── app/                              # expo-router: all routes go here
│   ├── _layout.tsx                   # Root layout — Stack, handles back button
│   ├── index.tsx                     # Splash/boot screen
│   ├── dashboard.tsx                 # Project dashboard (Stack screen)
│   └── (ide)/                        # Tab group — IDE Shell
│       ├── _layout.tsx               # Tabs layout + FileTreeOverlay
│       ├── editor.tsx                # Tab 1 — Editor
│       ├── search.tsx                # Tab 2 — Search
│       ├── git.tsx                  # Tab 3 — Git
│       └── settings/                 # Tab 4 — Settings (stack inside tab)
│
├── src/
│   ├── components/
│   │   ├── editor/                   # MonacoEditor, EditorTabs, ExtraKeyToolbar
│   │   ├── filetree/                # FileTreeOverlay, FileTree, FileNode
│   │   ├── git/                     # GitPanel, ChangesList, CommitInput
│   │   └── ui/                       # BottomSheet, ContextMenu, TopBar
│   ├── services/
│   │   ├── fs/                       # local.ts, saf.ts
│   │   ├── git/                      # isogit.ts
│   │   └── search/                   # local.ts (fuse.js)
│   ├── stores/                       # Zustand (MMKV-persisted)
│   │   ├── editor.store.ts
│   │   ├── filetree.store.ts
│   │   ├── git.store.ts
│   │   ├── project.store.ts
│   │   └── settings.store.ts
│   ├── utils/
│   │   ├── path.ts
│   │   ├── language-detect.ts
│   │   └── storage.ts
│   └── constants/
│       ├── themes.ts
│       ├── keybindings.ts
│       └── languages.ts
├── global.css                        # NativeWind directives
├── tailwind.config.js                # Custom colors + NativeWind preset
├── metro.config.js                   # NativeWind metro config
├── nativewind-env.d.ts               # TypeScript types
├── babel.config.js                   # NativeWind babel preset
├── app.json                          # Expo config (Android-only, minSdk 26)
└── package.json
```

---

## Key Constraints

- **NativeWind styling** — Use `className`, not `StyleSheet`
- **WebView for Monaco** — not native RN; postMessage is the only bridge
- **Browser build isomorphic-git** — no Node.js polyfills, runs inside WebView
- **Local files only** — app sandbox + SAF-accessible directories
- **HTTPS git auth only** — credentials in `expo-secure-store`; no SSH in V1
- **No Node.js polyfills in Metro** — use bridge pattern instead