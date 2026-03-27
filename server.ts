import 'zone.js/node';
import { CommonEngine } from '@angular/ssr/node';
import { AppServerModule } from './client/main.server';

// Comma-separated list of allowed hostnames for SSRF protection.
// In production set ALLOWED_HOSTS=neurimos.co.il,www.neurimos.co.il in .env
const allowedHosts: string[] = process.env['ALLOWED_HOSTS']
  ? process.env['ALLOWED_HOSTS'].split(',').map(h => h.trim())
  : ['localhost', '127.0.0.1'];

const engine = new CommonEngine({ allowedHosts });

export interface RenderOptions {
  url: string;
  documentFilePath: string;
  publicPath: string;
  serverUrl: string;
}

export async function renderSsr(opts: RenderOptions): Promise<string> {
  return engine.render({
    bootstrap: AppServerModule,
    documentFilePath: opts.documentFilePath,
    url: opts.url,
    publicPath: opts.publicPath,
    providers: [{ provide: 'serverUrl', useValue: opts.serverUrl }],
  });
}
