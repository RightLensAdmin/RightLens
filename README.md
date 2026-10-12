# RightLens — offline-first Scripture study PWA

A static, zero-API-cost Bible study app featuring **191 indexed verse references**, four righteous-focused categories, curated passage notes, cross-reference links, local favorites, and a CSV spreadsheet importer for a personal Righteousness Breakdown study.

## Run locally

```bash
npm install
npm run dev
```

## Publish free web app

1. Create a new GitHub repository named `rightlens` and upload this project's files (not the outer zip).
2. In Vercel, choose **Add New → Project → Import Git Repository** and select the repository.
3. Framework: **Other**; build command `npm run build`; output directory `dist`.
4. Deploy and use the **actual URL Vercel assigns**. A desired `rightlens.vercel.app` address is not guaranteed.
5. On iPhone Safari, Share → Add to Home Screen.

## Data and copyright

The bundled data are **references and original study summaries, not ESV verse text**. Do not present summaries as quotations. ESV full-text distribution or offline bundling requires suitable rights from Crossway. This app does not yet search every verse in the Bible; it searches the curated index. Add licensed Scripture data or a suitably licensed translation for whole-Bible search. All non-reviewed reference suggestions should be verified before publication.

## Import a study spreadsheet

Use the included `study-template.csv` and import it in the **Breakdown** tab. Columns: `topic,righteous_reference,contrasting_reference,commentary,chapter`. Data are stored in the browser on that device. No upload to a server. Back up the original spreadsheet; clearing browser storage removes local changes.

## Offline notes

The app caches its static shell and local verse index after first online visit. Offline installation requires a successful first load over HTTPS or localhost. Imported CSV data and favorites persist in localStorage. There is no user account, synchronization, or live AI API.
