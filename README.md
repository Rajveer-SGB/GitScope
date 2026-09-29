# GitScope — GitHub Profile Analyzer

GitScope is a responsive web app for exploring a developer's public GitHub profile and repositories. Enter a username to see their profile details, follower count, repositories, stars, and primary programming languages in one dashboard.

**Live site:** [github-profile-analyzer-alpha-one.vercel.app](https://github-profile-analyzer-alpha-one.vercel.app/)

## Features

- **Profile lookup:** View the avatar, name, bio, location, company, followers, following, and public repository count.
- **Repository explorer:** Browse public repositories with descriptions, stars, forks, primary language, and direct GitHub links.
- **Search and organize:** Search loaded repositories by name or description, filter by language, and sort by recent updates, stars, or name.
- **Language overview:** See how many loaded, non-fork repositories list each primary language.
- **Load more:** Fetch repositories in pages of up to 100.
- **Light and dark themes:** Switch themes with a toggle; the choice is remembered in the browser.
- **Error handling:** Messages for invalid usernames, missing profiles, network failures, and GitHub API limits.
- **Responsive design:** Works on desktop and mobile screens.

## Tech stack

| Part | Technology |
| --- | --- |
| Frontend | React |
| Build tool | Vite |
| Styling | CSS |
| Data | GitHub REST API |
| Deployment | Vercel |

## How it works

GitScope requests public data from these GitHub REST API endpoints:

```text
GET https://api.github.com/users/{username}
GET https://api.github.com/users/{username}/repos?per_page=100&page={page}&sort=updated
```

The app combines profile and repository data, then calculates the language overview from each loaded repository's **primary language**. Repository search, filtering, and sorting happen in the browser.

**Note:** The language overview counts repositories, not lines of code. Search and filtering cover repositories loaded so far; use **Load more repositories** to include additional pages. The app uses the API without a token, so GitHub may temporarily limit repeated requests.

## Run locally

Install [Node.js](https://nodejs.org/) version 18 or newer. Open a terminal in the folder containing `package.json` and run:

```bash
npm install
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`.

If PowerShell blocks `npm.ps1`, use:

```powershell
npm.cmd install
npm.cmd run dev
```

## Build and deploy

Check the production build:

```powershell
npm.cmd run build
```

Deploy from the project folder:

```powershell
npx.cmd vercel@latest login
npx.cmd vercel@latest --prod
```

The deployed app is available at the [live site](https://github-profile-analyzer-alpha-one.vercel.app/).

## Project structure

```text
github-profile-analyzer/
├── src/
│   ├── App.jsx        # Dashboard and interactions
│   ├── github.js      # GitHub API requests and data helpers
│   ├── styles.css     # Responsive layout and themes
│   └── main.jsx       # React entry point
├── index.html
├── package.json
└── vite.config.js
```

## Assignment requirements covered

| Requirement | In GitScope |
| --- | --- |
| Enter a GitHub username | Profile search form |
| Show profile picture, name, bio, followers | Profile card |
| Show repositories, stars, languages | Repository cards |
| Search or filter repositories | Search field and language filter |
| Handle invalid users and API errors | Validation and error messages |
| Responsive dashboard | Desktop and mobile CSS layouts |