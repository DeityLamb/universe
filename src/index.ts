import { serve } from '@hono/node-server';
import { Scalar } from '@scalar/hono-api-reference';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Hono } from 'hono';
import { openAPISpecs } from 'hono-openapi';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { authRoute } from './app/auth/route.js';
import { projectsRoute } from './app/projects/route.js';
import { PORT } from './constants.js';
import { db } from './infra/db.js';

const app = new Hono();

app.use(logger());

app.use(
  cors({
    origin: (origin) => origin, // allow any
    credentials: true,
  })
);

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.route('/api/auth', authRoute);
app.route('/api/projects', projectsRoute);

app.onError((err: any, c) => {
  return c.json({ error: err.message }, err.status ?? err.statusCode ?? 500);
});

app.get(
  '/openapi',
  openAPISpecs(app, {
    documentation: {
      info: {
        title: 'Docs',
        version: '1.0.0',
      },
      servers: [{ url: 'http://localhost:3000', description: 'Local Server' }],
    },
  })
);

app.get('/docs', Scalar({ url: '/openapi', theme: 'purple' }));

async function main() {
  await migrate(db, {
    migrationsFolder: './drizzle',
  });

  serve({ fetch: app.fetch, port: PORT }, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  });
}

main();
