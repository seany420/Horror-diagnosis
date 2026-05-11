# DEPLOY.md — GitHub Pages Deployment

This is a static single-page application. There is no build step, no bundler, no package manager, no server-side code. GitHub Pages serves it as-is.

## Step 1 — Create the repo on GitHub

1. Go to https://github.com/new
2. Repository name: `scream-profile` (or any name you prefer)
3. Visibility: **Public** (required for free GitHub Pages)
4. Do **not** initialize with a README, .gitignore, or license — you already have those locally
5. Click **Create repository**

## Step 2 — Push the local repo

In your terminal, from inside the `scream-profile` directory:

```bash
git init
git add .
git commit -m "Initial commit — SCREAM PROFILE v1.0"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/scream-profile.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

## Step 3 — Enable GitHub Pages

1. Go to your repo on GitHub: `https://github.com/YOUR-USERNAME/scream-profile`
2. Click **Settings** (top nav of the repo)
3. In the left sidebar, click **Pages**
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

GitHub will display a banner reading something like *"Your site is live at `https://YOUR-USERNAME.github.io/scream-profile/`"* (it may take 30–90 seconds the first time).

## Step 4 — Verify

1. Visit `https://YOUR-USERNAME.github.io/scream-profile/`
2. You should see the SCREAM PROFILE intro screen with the skull mark and "Begin Screening" button
3. Click through a few items to confirm the battery renders, then exit (or complete it) to confirm the report renders

## Why `.nojekyll` matters

GitHub Pages defaults to running every site through Jekyll, a static site generator. Jekyll ignores any folder beginning with an underscore and applies template processing to Markdown — both of which can break a hand-coded SPA. The empty `.nojekyll` file at the repo root tells GitHub Pages "serve everything as-is, don't process anything."

If you don't see the `.nojekyll` file in your local clone, run:

```bash
touch .nojekyll
git add .nojekyll
git commit -m "Add .nojekyll"
git push
```

## Custom domain (optional)

If you own a domain and want to serve the app from `screamprofile.example.com`:

1. In GitHub: **Settings → Pages → Custom domain**, enter your domain and click **Save**
2. In your DNS provider, add a CNAME record:
   - Name: `screamprofile` (or `@` for apex)
   - Target: `YOUR-USERNAME.github.io`
3. After DNS propagates (usually under an hour), check **Enforce HTTPS** in the Pages settings

GitHub will create a `CNAME` file in the repo automatically; don't delete it.

## Updating the app

After pushing changes to `main`, GitHub Pages rebuilds automatically — usually within 30 seconds. You can watch the deployment in your repo's **Actions** tab under the *pages-build-deployment* workflow.

If a deployment fails, the most common causes are:

- **Missing `.nojekyll`** — Jekyll tried to process something it shouldn't have
- **Folder names starting with `_`** — Jekyll ignores these by default; `.nojekyll` fixes this
- **Case-sensitive paths** — GitHub Pages is case-sensitive (Linux), but local development on macOS/Windows often is not. If a file is `Style.css` locally but referenced as `style.css` in `index.html`, it'll work locally and break on Pages. Stick to lowercase filenames.

## Troubleshooting

**Blank page after deployment**: Open the browser devtools console. Most often the issue is a 404 on a script — usually a path mismatch or case-sensitivity. The repo uses all lowercase filenames; if you've added new files, match that convention.

**Fonts not loading**: The CSS imports Google Fonts via `@import`. If your network blocks Google's CDN, replace the imports with locally-hosted font files in an `assets/fonts/` directory and update the `@font-face` rules accordingly.

**Items advancing too fast**: The `setTimeout` delays in `recordResponse` (180ms / 220ms) are intentional — they give a tactile feel. Adjust in `js/app.js` if you want the battery to feel snappier or more deliberate.

**Report not generating**: Open devtools, check the console for any errors thrown from `generateReport`. The most common cause is a malformed response value (NaN), which happens if a custom scale was added without proper numeric values. Run `node test-engine.js` locally to verify the engine still produces reports for the canonical profiles.

## Privacy note for users

The app is fully client-side. All scoring happens in the browser; nothing is sent to any server. The JSON export is generated client-side via `URL.createObjectURL`. There is no analytics, no telemetry, no cookies. If you fork this and add analytics, **disclose it prominently** — the consent screen and README both promise local-only processing.
