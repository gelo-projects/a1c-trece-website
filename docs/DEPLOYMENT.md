# Preview-only Cloudflare deployment

Project: `a1c-trece-website`  
Account: `6ee7e690ba0dbd142ef7794a624f0907`  
Reserved production branch: `main`  
Review branch: `phase-1-foundation`

The project uses Cloudflare Pages Direct Upload so preview hosting is independent of repository-creation permissions. Source is versioned in Git locally; a GitHub remote may be attached later. GitHub CI can upload the same static artifacts to this Direct Upload project when a scoped token is deliberately configured. No production workflow is present.

## Build and preview

```sh
npm ci
npm test
npm run build
npx wrangler pages deploy dist --project-name a1c-trece-website --branch phase-1-foundation
```

The final command requires authorized Cloudflare credentials; it must never default to the production branch. During this task the connected Cloudflare service provides a short-lived asset-upload JWT via hidden stdin to Wrangler, then creates the preview deployment through its authenticated API. Tokens are not stored in this repository, files, logs or command arguments.

## Approval boundary

- `main` has no deployed production version.
- Review URLs grant website viewing only; they do not grant repository, deployment or admin access.
- Review links are publicly reachable by anyone who has the URL, with search indexing disabled. They are not an authentication boundary.
- Production requires explicit owner/Admin-OIC approval at the launch phase.
- Preserve the original A1C operations project; this website never modifies its current deployment.

## Rollback

Keep reviewed commits and deployment URLs. To restore a previous preview, rebuild the reviewed commit in a separate checkout and upload it to the same preview branch. Do not use the production rollback endpoint for phase review.
