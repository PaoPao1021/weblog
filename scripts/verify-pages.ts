import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

const basePath = '/pages-check/';
const publicSiteUrl = 'https://example.invalid/pages-check/';
const distDirectory = resolve('dist');

function run(command: string, args: string[], environment: NodeJS.ProcessEnv): Promise<void> {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, args, { stdio: 'inherit', env: environment });
    child.once('error', rejectRun);
    child.once('exit', (code, signal) => {
      if (code === 0) resolveRun();
      else rejectRun(new Error(`${command} ${args.join(' ')} exited with ${signal ?? `code ${code}`}.`));
    });
  });
}

function buildEnvironment(overrides: Record<string, string | undefined>): NodeJS.ProcessEnv {
  const environment = { ...process.env };
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) delete environment[key];
    else environment[key] = value;
  }
  return environment;
}

function attribute(tag: string, name: string): string | undefined {
  return tag.match(new RegExp(`\\b${name}="([^"]+)"`, 'i'))?.[1];
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Pages verification failed: ${message}`);
}

async function serveStatic(): Promise<{ origin: string; close: () => Promise<void> }> {
  const server = createServer(async (request: IncomingMessage, response: ServerResponse) => {
    try {
      const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
      if (!pathname.startsWith(basePath)) {
        response.writeHead(404).end('Not found');
        return;
      }

      const relativePath = decodeURIComponent(pathname.slice(basePath.length));
      const candidate = relativePath === '' ? resolve(distDirectory, 'index.html') : resolve(distDirectory, relativePath);
      if (candidate !== distDirectory && !candidate.startsWith(`${distDirectory}${sep}`)) {
        response.writeHead(404).end('Not found');
        return;
      }

      const details = await stat(candidate);
      if (!details.isFile()) {
        response.writeHead(404).end('Not found');
        return;
      }

      const extension = candidate.split('.').pop();
      const contentType = extension === 'html' ? 'text/html' : extension === 'css' ? 'text/css' : extension === 'js' ? 'text/javascript' : extension === 'svg' ? 'image/svg+xml' : extension === 'png' ? 'image/png' : 'text/plain';
      response.writeHead(200, { 'content-type': contentType });
      response.end(await readFile(candidate));
    } catch {
      response.writeHead(404).end('Not found');
    }
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  assert(address && typeof address !== 'string', 'static server did not bind a TCP port');
  return { origin: `http://127.0.0.1:${address.port}`, close: () => new Promise((resolveClose, rejectClose) => server.close((error) => error ? rejectClose(error) : resolveClose())) };
}

async function get(url: string): Promise<Response> {
  const response = await fetch(url);
  assert(response.status === 200, `${url} returned ${response.status}, expected 200`);
  return response;
}

async function verifyBuild(): Promise<void> {
  const server = await serveStatic();
  try {
    const index = await get(`${server.origin}${basePath}`);
    const html = await index.text();
    assert(index.headers.get('content-type')?.includes('text/html'), 'index did not have an HTML content type');

    const scriptTag = [...html.matchAll(/<script\b[^>]*>/gi)].find((tag) => attribute(tag[0], 'type') === 'module');
    const stylesheetTag = [...html.matchAll(/<link\b[^>]*>/gi)].find((tag) => attribute(tag[0], 'rel') === 'stylesheet');
    const faviconTag = [...html.matchAll(/<link\b[^>]*>/gi)].find((tag) => attribute(tag[0], 'rel') === 'icon');
    const scriptPath = scriptTag && attribute(scriptTag[0], 'src');
    const stylesheetPath = stylesheetTag && attribute(stylesheetTag[0], 'href');
    const faviconPath = faviconTag && attribute(faviconTag[0], 'href');
    const ogImage = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)?.[1];

    assert(scriptPath?.startsWith(basePath), 'module script does not use the Pages subpath');
    assert(stylesheetPath?.startsWith(basePath), 'stylesheet does not use the Pages subpath');
    assert(faviconPath === `${basePath}favicon.svg`, 'favicon does not use the Pages subpath');
    assert(ogImage === `${publicSiteUrl}og-image.png`, 'OG image does not use SITE_URL and the Pages subpath');

    const script = await get(`${server.origin}${scriptPath}`);
    const stylesheet = await get(`${server.origin}${stylesheetPath}`);
    await get(`${server.origin}${faviconPath}`);
    await get(`${server.origin}${basePath}images/projects/project-one.svg`);
    await get(`${server.origin}${basePath}og-image.png`);
    assert(script.headers.get('content-type')?.includes('javascript'), 'script did not have a JavaScript content type');
    assert(stylesheet.headers.get('content-type')?.includes('text/css'), 'stylesheet did not have a CSS content type');

    const robots = await (await get(`${server.origin}${basePath}robots.txt`)).text();
    const sitemap = await (await get(`${server.origin}${basePath}sitemap.xml`)).text();
    assert(robots.includes(`Sitemap: ${publicSiteUrl}sitemap.xml`), 'robots.txt sitemap URL is incorrect');
    assert(sitemap.includes(`<loc>${publicSiteUrl}</loc>`), 'sitemap location is incorrect');

    const hashRoute = await get(`${server.origin}${basePath}#/projects`);
    assert((await hashRoute.text()).includes('<div id="root"></div>'), 'hash route did not request the entry document');
    const missing = await fetch(`${server.origin}${basePath}not-a-real-server-path`);
    assert(missing.status === 404, `static server returned ${missing.status} for a nonexistent route instead of 404`);
  } finally {
    await server.close();
  }
}

let verificationError: unknown;
try {
  await run('npm', ['run', 'build'], buildEnvironment({ VITE_BASE_PATH: basePath, SITE_URL: publicSiteUrl }));
  await verifyBuild();
  console.log('GitHub Pages subpath verification passed.');
} catch (error) {
  verificationError = error;
} finally {
  try {
    await run('npm', ['run', 'build'], buildEnvironment({ VITE_BASE_PATH: undefined, SITE_URL: undefined }));
  } catch (error) {
    if (!verificationError) verificationError = error;
  }
}

if (verificationError) throw verificationError;
