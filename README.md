# Student Dashboard Bookmark

This project is a static installer site for a Canvas bookmark dashboard.

## What it is

- A normal website people can open in a browser
- An installer page for a bookmarklet
- Not a browser extension

## Local use

1. Open `index.html` in a browser.
2. Drag `Drag This Bookmark` to the bookmarks bar, or copy the bookmark code.
3. Open Canvas.
4. Click the saved bookmark.

## Share with other people

The easiest way is to publish this folder as a free static website.

Then another person can:

1. Open your public website link
2. Drag the bookmark button to their bookmarks bar
3. Open their own Canvas
4. Click the bookmark

## Free hosting options

## GitHub Pages

1. Create a GitHub repository.
2. Upload all files in this folder.
3. Go to the repository `Settings`.
4. Open `Pages`.
5. Under `Build and deployment`, set:
   `Source` -> `Deploy from a branch`
6. Choose:
   `Branch` -> `main`
   `Folder` -> `/ (root)`
7. Save.
8. GitHub will give you a public URL like:
   `https://yourname.github.io/repo-name/`

Notes:

- The `.nojekyll` file is included so GitHub Pages serves this as a plain static site.

## Netlify

1. Create a free Netlify account.
2. Click `Add new site`.
3. Choose `Deploy manually`, or connect a GitHub repo.
4. Upload this whole folder.
5. Netlify will give you a URL like:
   `https://your-site-name.netlify.app`

Notes:

- `netlify.toml` is included so Netlify knows to publish this folder directly.

## Vercel

1. Create a free Vercel account.
2. Import the project from GitHub, or upload it.
3. Keep the project as a static site.
4. Vercel will give you a URL like:
   `https://your-project.vercel.app`

## Important

- If you change `app.js`, you need to republish the site.
- If someone already saved an older bookmark, they should delete it and install the new one again.
- Some schools may block certain Canvas API data, so some panels may show limited results.
