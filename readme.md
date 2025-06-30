# React Insight AI - Chrome Extension

React Insight AI is a Chrome DevTools extension that hooks into a webpage's React Fiber tree and visualizes it in a user-friendly way via a popup. This is an experimental developer tool for debugging and introspection of React components.

---

## 🔧 Features

- Injects a script into any page running React.
- Hooks into the internal React Fiber tree.
- Extracts and serializes the component tree.
- Sends it back to the extension popup UI.
- (Optional for future): Send the tree to an LLM to get an explanation of render behavior.

---

## 📁 Project Structure

```
React-insight-extension/
├── background.js         # Handles extension messages
├── content.js            # Injects script into the web page
├── injected.js           # Accesses React fiber from the page context
├── popup.html            # UI of the extension
├── popup.js              # Handles fiber data display
├── styles.css            # Popup styling
├── manifest.json         # Chrome extension config
└── README.md             # This file
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/react-insight-extension.git
cd react-insight-extension
```

### 2. Load the extension

1. Visit `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the project folder

### 3. Visit a React site

Navigate to any site that uses React, and open the popup from the extension icon to see the captured fiber tree.

---

## ⚠️ Requirements

- React must be present on the page.
- `__REACT_DEVTOOLS_GLOBAL_HOOK__` must be accessible (auto-injected by React DevTools)

---

## 📌 Troubleshooting

- `ERR_FAILED chrome-extension://invalid/` → Add `injected.js` under `web_accessible_resources` in `manifest.json`
- `document.head` is null → fallback to `DOMContentLoaded` in `content.js`
- No fiber tree? → Make sure React is loaded and the app has rendered at least once

---

## 📦 Planned Features

- Component-level insights with AI (OpenAI or local LLMs)
- Highlight component in DOM on hover
- Expand/collapse fiber branches
- Export fiber snapshots

---

## 🧠 Inspiration

This project is inspired by the internals of React Fiber and the React DevTools architecture. It’s built to help devs explore and understand rendering patterns in large-scale applications.

---

## 📄 License

MIT License

---

Built with 💡