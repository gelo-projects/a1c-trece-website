# Preview-only Cloudflare deployment

Project: `a1c-trece-website`  
Account: `6ee7e690ba0dbd142ef7794a624f0907`  
Reserved production branch: `main`  
Review branch: `phase-1-foundation`

- Owner preview: https://phase-1-foundation.a1c-trece-website.pages.dev
- Phase 1 deployment: https://bef13aa3.a1c-trece-website.pages.dev
- Uploaded source commit: `48d87c60f4427d1860b1e64e910bdca8e03b0dfb`
- Deployment environment: `preview` (16 October 2026)

The project uses Cloudflare Pages Direct Upload. Source and phase history are stored at https://github.com/gelo-projects/a1c-trece-website on `main` and `phase-1-foundation`. GitHub Actions runs checks only. Preview uploads are separate from repository pushes, and no production workflow is present.

## Build and preview

```sh
npm ci
npm test
npm run build
npx wrangler pages deploy dist --project-name a1c-trece-website --branch phase-1-foundation
```

The final command requires authorized Cloudflare credentials; it must never default to the production branch. For this review, the connected Cloudflare service supplies a short-lived asset-upload JWT through hidden stdin to a direct asset uploader; the connected service then creates the preview deployment through its authenticated API. This avoids Wrangler's separate login requirement. Tokens are not stored in this repository, files, logs or command arguments.

## Approval boundary

- `main` has no deployed production version.
- Review URLs grant website viewing only; they do not grant repository, deployment or admin access.
- Review links are publicly reachable by anyone who has the URL, with search indexing disabled. They are not an authentication boundary.
- Production requires explicit owner/Admin-OIC approval at the launch phase.
- Preserve the original A1C operations project; this website never modifies its current deployment.

## Rollback

Keep reviewed commits and deployment URLs. To restore a previous preview, rebuild the reviewed commit in a separate checkout and upload it to the same preview branch. Do not use the production rollback endpoint for phase review.
