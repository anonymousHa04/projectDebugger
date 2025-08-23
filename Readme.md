---
description: Repository Information Overview
alwaysApply: true
---

# React Insight AI Chrome Extension Information

## Summary
React Insight AI is a Chrome DevTools extension that hooks into a webpage's React Fiber tree and visualizes it in a user-friendly way via a popup. It's designed for debugging and introspection of React components, allowing developers to explore and understand rendering patterns in React applications.

## Structure
- **background.js**: Handles extension message passing between content scripts and popup
- **content.js**: Injects scripts into web pages to access React internals
- **injected.js**: Accesses React fiber tree from the page context
- **popup.html/js**: UI interface for displaying the captured fiber tree
- **styles.css**: Styling for the popup interface
- **manifest.json**: Chrome extension configuration
- **hashira.png**: Extension icon

## Language & Runtime
**Language**: JavaScript
**Version**: ES6+
**Build System**: None (unpacked Chrome extension)
**Package Manager**: None (standalone extension)

## Dependencies
**Runtime Dependencies**:
- Chrome Extension API
- React DevTools Global Hook (`__REACT_DEVTOOLS_GLOBAL_HOOK__`)

## Build & Installation
```bash
# No build process required
# Installation:
# 1. Visit chrome://extensions
# 2. Enable Developer mode
# 3. Click Load unpacked
# 4. Select the project folder
```

## Main Files
**Entry Points**:
- **manifest.json**: Extension configuration and entry point definition
- **background.js**: Service worker background script
- **content.js**: Content script injected into web pages
- **popup.html**: UI entry point

**Key Components**:
- **injected.js**: Core functionality for accessing React Fiber tree
- **popup.js**: Handles displaying the fiber tree data

## Extension Configuration
**Manifest Version**: 3
**Permissions**:
- activeTab
- scripting
- storage
- host_permissions: `<all_urls>`

**Content Scripts**:
- content.js (matches: `<all_urls>`, run_at: document_idle)

**Web Accessible Resources**:
- injected.js (accessible to all URLs)

## Functionality
**Core Features**:
- Injects a script into any page running React
- Hooks into the internal React Fiber tree
- Extracts and serializes the component tree
- Sends it back to the extension popup UI

**Implementation Details**:
- Uses Chrome messaging API for communication between components
- Leverages React DevTools hook to access Fiber tree
- Traverses and serializes Fiber nodes recursively