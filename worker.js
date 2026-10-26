// Static asset server for the Blockbuilt demos (Cloudflare Workers).
//
// The site is plain HTML/CSS/JS, so this worker does no rendering and no path
// rewriting. The asset layer resolves a directory URL to its index.html and
// redirects "/demos/barbershop" to "/demos/barbershop/".
//
// Do not add a "/" -> "/index.html" rewrite: the asset layer redirects
// "/index.html" back to "/", so that rewrite loops forever.
//
// Deploy with deploy.json, which serves ./build/public:
//   npx wrangler dev --config build/wrangler.local.jsonc   # local workerd check
//   then deploy deploy.json to the site's preview environment.

export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
