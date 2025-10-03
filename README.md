

# TalentFlow

[![Live Demo](https://img.shields.io/badge/Live%20Demo-talent--flow--plum--three.vercel.app-blue?style=flat-square)](https://talent-flow-plum-three.vercel.app)

**Live App:** [https://talent-flow-plum-three.vercel.app](https://talent-flow-plum-three.vercel.app)

TalentFlow is a modern, full-featured hiring pipeline management platform built with React, Vite, Redux Toolkit, and Tailwind CSS.

## Features
- Manage jobs, candidates, and assessments in one place
- Add, edit, and delete jobs and candidates
- Build and preview assessments for candidates
- Modern, responsive UI with beautiful design
- Local persistence using IndexedDB (Dexie)

## Getting Started

1. **Install dependencies:**
	```
	npm install
	```

2. **Run the development server:**
	```
	npm run dev
	```
	The app will be available at [http://localhost:5173](http://localhost:5173) (or another port if 5173 is in use).


## Deployment

This project is deployed and live at:

👉 [https://talent-flow-plum-three.vercel.app](https://talent-flow-plum-three.vercel.app)

You can also deploy your own version to Vercel, Netlify, or any static hosting provider. For Vercel:

1. Push your code to GitHub.
2. Go to [https://vercel.com/](https://vercel.com/) and import your repository.
3. Click "Deploy". Vercel will auto-detect the Vite/React setup.
4. Share your live link!

## Project Structure

- `src/` — Main source code
- `src/pages/` — App pages (Home, Jobs, Candidates, Assessments)
- `src/components/` — Reusable UI components
- `src/app/` — Redux store and slices
- `src/api/` — API abstraction
- `src/persistence/` — IndexedDB logic

## License

MIT
