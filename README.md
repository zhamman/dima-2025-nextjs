# Dmitriy Usov Portfolio - Next.js Version

This is a Next.js version of the Dmitriy Usov Portfolio website, migrated from Create React App (CRA).

## Features

- Server-side rendering (SSR) for faster initial page loads
- Automatic code splitting for optimized performance
- Next.js file-based routing instead of React Router
- Same UI and functionality as the original CRA version
- SCSS styling (no TypeScript or Tailwind)

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `pages/` - Next.js pages (file-based routing)
- `components/` - React components
- `styles/` - SCSS stylesheets
- `data/` - Data files
- `hooks/` - Custom React hooks
- `utils/` - Utility functions
- `public/` - Static assets

## Build for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

Then, you can start the production server:

```bash
npm run start
# or
yarn start
```

## Deployment

This Next.js application is optimized for deployment on Vercel or any other hosting platform that supports Next.js.
