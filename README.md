# Unstability

A modern Next.js application deployed to Cloudflare Workers via Alchemy.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with Server Components
- **TypeScript** - Type-safe development with strict mode
- **Cloudflare Workers** - Edge deployment platform
- **Alchemy** - Infrastructure as code for Cloudflare
- **Bun** - Fast JavaScript runtime and package manager

## Prerequisites

- [Bun](https://bun.sh/) installed on your system
- Cloudflare account (for deployment)

## Getting Started

### Installation

```bash
bun install
```

### Development

Start the local development server:

```bash
bun run dev
```

This runs Alchemy's development server, which simulates the Cloudflare Workers environment locally. Your app will be available at `http://localhost:3000`.

### Building

Build the application for production:

```bash
bun run build
```

## Deployment

This project deploys to Cloudflare Workers using Alchemy:

```bash
bun run deploy
```

To remove the deployment:

```bash
bun run destroy
```

### Environment Variables

Copy `.env.example` to `.env` and set your variables:

```bash
ALCHEMY_PASSWORD=your-password-here
```

## Code Quality

The project enforces strict code quality standards:

### Linting

```bash
bun run lint         # Check for issues
bun run lint:fix     # Auto-fix issues
```

### Formatting

```bash
bun run format       # Format all files
bun run format:check # Check formatting
```

### Pre-commit Hooks

Git hooks automatically run on every commit to:
- Fix ESLint errors
- Format code with Prettier
- Remove unused imports
- Sort imports

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Alchemy Documentation](https://docs.alchemy.run)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [OpenNext for Cloudflare](https://opennext.js.org/cloudflare)
