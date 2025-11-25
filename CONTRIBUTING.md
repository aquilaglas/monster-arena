# Contributing to Monster Arena

We welcome contributions! Here's how to get involved.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/monster-arena.git`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Install dependencies: `npm install`
5. Start development: `npm run dev:desktop` or `npm run dev`

## Code Style

We use ESLint and Prettier for code consistency:

\`\`\`bash
# Lint code
npm run lint

# Format code
npm run format
\`\`\`

All code must pass linting before being merged.

## Commit Messages

- Use clear, descriptive commit messages
- Start with a verb: "Add", "Fix", "Update", "Remove"
- Example: "Add new monster type - Phoenix"

## Pull Requests

1. Push to your fork
2. Open a Pull Request to the main repository
3. Describe what your changes do
4. Reference any related issues (#123)
5. Wait for CI checks to pass
6. Request review from maintainers

## Development Guidelines

### Game Mechanics
- All gameplay changes must be in `/lib/game-state.ts`
- API routes handle business logic in `/app/api/`
- Keep game balance in mind (reward values, costs, stat improvements)

### UI Components
- Components go in `/components/`
- Use TailwindCSS for styling
- All text must be in French
- Test responsive design (mobile, tablet, desktop)

### French Localization
- All UI text, buttons, labels must be in French
- User-facing messages should be clear and concise
- Maintain game terminology consistency

### Testing
- Test in both browser and Electron
- Verify on Windows, macOS, and Linux when possible
- Test with different screen sizes

## Areas for Contribution

- New monster types and balancing
- UI/UX improvements
- Bug fixes
- Performance optimizations
- Documentation improvements
- Localization (if expanding to other languages)

## Need Help?

- Check [README.md](./README.md) for overview
- See [ELECTRON_SETUP.md](./ELECTRON_SETUP.md) for desktop development
- See [INSTALLATION.md](./INSTALLATION.md) for setup issues
- Open an issue for questions

Thank you for contributing!
