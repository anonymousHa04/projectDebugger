# 📚 React Insight AI - Documentation

Welcome to the React Insight AI documentation! This folder contains all the technical documentation, guides, and test files for the project.

## 📖 Documentation Files

### 🏗️ **[MODULAR_STRUCTURE.md](./MODULAR_STRUCTURE.md)**
Complete guide to the modular code architecture, including:
- Helper modules breakdown
- Code organization structure
- Benefits of modularization
- Build process explanation

### 🔧 **[README-TypeScript.md](./README-TypeScript.md)**
TypeScript-specific documentation covering:
- Type definitions
- Compilation setup
- TypeScript configuration

## 🧪 Test Files

### 🌐 **Test HTML Pages**
- **[test-modular.html](./test-modular.html)** - Test page for the modular injected script
- **[test-react-app.html](./test-react-app.html)** - React application test page
- **[simple-test.html](./simple-test.html)** - Simple React component test

### 🔨 **Build Tools**
- **[build-modular.js](../build-modular.js)** - Build script for combining modular TypeScript files (located in project root)

## 🚀 Quick Start

1. **Load Extension**: Load the project root as an unpacked Chrome extension
2. **Test Pages**: Open any of the test HTML files to verify functionality
3. **Development**: Use the modular structure for easier code maintenance

## 📁 Project Structure

```
projectDebugger/
├── src/                    # Source TypeScript files
│   ├── helpers/           # Modular helper functions
│   ├── injected-clean.ts  # Main clean injected script
│   └── ...
├── dist/                  # Compiled JavaScript files
├── docs/                  # Documentation and tests (this folder)
├── Readme.md             # Main project README
└── manifest.json         # Chrome extension manifest
```

## 🔍 Key Features

- **🧩 Modular Architecture**: Clean separation of concerns
- **🛡️ Safety Features**: Timeout protection, circular reference detection
- **⚡ Performance**: Throttling and node limits
- **📊 Detailed Logging**: Comprehensive debugging output
- **🔧 TypeScript**: Full type safety and modern JavaScript features

## 🤝 Contributing

When making changes:
1. Update relevant documentation
2. Test with the provided HTML test files
3. Ensure TypeScript compilation works
4. Update this README if adding new documentation

---

For the main project overview, see the [main README](../Readme.md) in the project root.