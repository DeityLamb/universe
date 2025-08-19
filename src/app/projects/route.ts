import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { validator } from 'hono-openapi/zod';
import z from 'zod';
import { projectRepo } from '../../domain/projects/project.repository.js';
import { githubClient } from '../../infra/github.client.js';
import { authGuard, getAccount } from '../auth/guard.js';

export const projectsRoute = new Hono();

projectsRoute.get(
  '/',
  authGuard(),
  describeRoute({
    description: 'Get list of projects',
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                  url: { type: 'string' },
                  stars: { type: 'integer' },
                  forks: { type: 'integer' },
                  issues: { type: 'integer' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  }),
  async (c) => {
    const list = await projectRepo.findAllByOwner(getAccount(c));

    return c.json(list);
  }
);

projectsRoute.delete(
  '/:id',
  authGuard(),
  describeRoute({
    description: 'Delete project',
    responses: {
      200: {
        description: 'Success',
      },
      404: {
        description: 'Project not found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string' },
              },
            },
          },
        },
      },
    },
  }),
  validator(
    'param',
    z.object({
      id: z
        .string()
        .transform(Number)
        .refine((v) => !isNaN(v), 'Invalid id param'),
    })
  ),
  async (c) => {
    const { id } = c.req.valid('param');

    const project = await projectRepo.findById(id);

    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }

    await projectRepo.deleteByOwnerAndId(getAccount(c), id);

    return c.body(null);
  }
);

projectsRoute.post(
  '/',
  authGuard(),
  describeRoute({
    description: 'Create project',
    responses: {
      200: {
        description: 'Success',
      },
      400: {
        description: 'Invalid data',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string' },
              },
            },
          },
        },
      },
    },
  }),
  validator(
    'json',
    z.object({
      fullName: z
        .string()
        .regex(
          /^[\w.-]+\/[\w.-]+$/,
          'Invalid repo full name format (e.g. facebook/reack)'
        ),
    })
  ),
  async (c) => {
    const { fullName } = c.req.valid('json');

    const [ownerPart, repoPart] = fullName.split('/');

    const repo = await githubClient.rest.repos.get({
      owner: ownerPart,
      repo: repoPart,
    });

    const res = await projectRepo.upsert({
      ownerId: getAccount(c).id,
      fullName,
      issues: repo.data.open_issues_count,
      forks: repo.data.forks_count,
      stars: repo.data.stargazers_count,
      name: repo.data.name,
      url: repo.data.html_url,
      createdAt: new Date(repo.data.created_at),
      updatedAt: new Date(repo.data.updated_at),
    });

    return c.json(res);
  }
);
