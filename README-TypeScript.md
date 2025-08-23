# React Insight AI - TypeScript Version

This Chrome extension has been converted to TypeScript for better type safety and development experience.

## Project Structure

```
├── src/                    # TypeScript source files
│   ├── background.ts       # Service worker background script
│   ├── content.ts          # Content script injected into web pages
│   ├── injected.ts         # Script that accesses React Fiber tree
│   └── popup.ts            # Popup UI logic
├── types/                  # Type definitions
│   ├── react-fiber.d.ts    # React Fiber internals types
│   └── extension-messages.d.ts # Extension message types
├── dist/                   # Compiled JavaScript output
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and build scripts
```

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. For development with auto-compilation:
```bash
npm run dev
```

## Loading the Extension

1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` folder (not the root project folder)

## Build Scripts

- `npm run build` - Compile TypeScript and copy static assets
- `npm run watch` - Watch for changes and recompile
- `npm run clean` - Remove dist folder
- `npm run dev` - Clean, build, and watch

## Type Safety Features

- **React Fiber Types**: Proper typing for React internals
- **Chrome Extension APIs**: Full type support for Chrome extension APIs
- **Message Passing**: Typed message interfaces between extension components
- **Strict TypeScript**: Enabled strict mode for maximum type safety

## Key Improvements

1. **Type Safety**: Catch errors at compile time
2. **Better IDE Support**: IntelliSense, auto-completion, and refactoring
3. **Documentation**: Types serve as inline documentation
4. **Maintainability**: Easier to refactor and extend
5. **Error Prevention**: Prevents common JavaScript runtime errors