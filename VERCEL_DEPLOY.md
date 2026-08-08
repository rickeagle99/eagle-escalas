# Deploy Eagle Escalas NewSky API on Vercel

1. Open https://vercel.com/new
2. Import the GitHub repository `rickeagle99/eagle-escalas`.
3. Keep the default framework settings.
4. Deploy.
5. In the Vercel project open **Settings → Environment Variables**.
6. Add:
   - Name: `NEWSKY_API_TOKEN`
   - Value: your new NewSky API key
   - Environments: Production (and Preview if desired)
7. Redeploy the project after saving the variable.
8. The API endpoint will be:
   `https://SEU-PROJETO.vercel.app/api/newsky?action=status`

The API key is server-side only and is never committed to GitHub or sent to the browser.

## Frontend URL

After Vercel deployment, set `window.EAGLE_NEWSKY_API_URL` in the GitHub Pages frontend to:
`https://SEU-PROJETO.vercel.app/api/newsky`

Do not put the NewSky API key in `newsky.js`.
