# GitScope — GitHub Profile Analyzer

A responsive React dashboard that uses the public GitHub REST API to show a developer's profile, followers, public repositories, stars, and primary programming languages.

## Run locally

Install [Node.js](https://nodejs.org/) (version 18 or newer). In a terminal inside this folder:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

**Windows PowerShell:** If it says `npm.ps1 cannot be loaded because running scripts is disabled`, use these commands instead, one at a time:

```powershell
npm.cmd install
npm.cmd run dev
```

## Features

- Search for a GitHub username, including `@username` input
- Profile avatar, name, bio, follower count, and GitHub link
- Public repositories with descriptions, stars, forks, and primary language
- Search loaded repositories by name or description, filter by language, and sort by update date, stars, or name
- Language breakdown of loaded, non-fork repositories
- Pagination with **Load more** for profiles with over 100 repositories
- Helpful username, network, missing user, and API limit error messages
- Responsive desktop and mobile layouts
- Greptile-inspired editorial layout with original graphics and a light/dark mode toggle that remembers your choice

The language breakdown counts each repository's **primary language**, not lines of code. GitHub may restrict unauthenticated API requests, so an API limit message may appear after repeated searches. No API token is required or included.

## Deploy to Vercel

### Option A: Vercel website

1. Create an empty GitHub repository and push this folder to it (instructions below).
2. On [vercel.com/new](https://vercel.com/new), import that repository.
3. Use **Vite** as the framework. The build command is `npm run build` and the output directory is `dist` (Vercel normally detects both).
4. Click **Deploy**. Vercel provides a public `*.vercel.app` link.

### Option B: Vercel CLI

Run `npx vercel` inside this folder, sign in when prompted, then run `npx vercel --prod` to deploy publicly. The first command may ask to link or create a project.

## Push to GitHub

From this folder, replace `YOUR_USERNAME` with your GitHub username:

```bash
git init
git add .
git commit -m "Build GitHub profile analyzer"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/github-profile-analyzer.git
git push -u origin main
```

Create the empty repository on GitHub before the `git push` command. GitHub may ask you to sign in. Do not commit `node_modules`, `dist`, or credentials; `.gitignore` excludes them.

## Project structure

```text
src/App.jsx       Dashboard UI and interaction
src/github.js     GitHub API requests and data helpers
src/styles.css    Responsive visual design
src/main.jsx      React entry point
```
