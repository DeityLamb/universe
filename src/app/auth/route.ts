import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { validator } from 'hono-openapi/zod';
import z from 'zod';
import { accountRepo } from '../../domain/accounts/account.repository.js';
import { sessionRepo } from '../../domain/accounts/session.repository.js';
import { otpService } from '../../domain/otp/otp.service.js';
import { emailClient } from '../../infra/mail.client.js';
import { applySession, authGuard, getAccount } from './guard.js';

export const authRoute = new Hono();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const codeSchema = z.object({
  email: z.string().email(),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  code: z.string(),
});

authRoute.get(
  '/me',
  authGuard(),
  describeRoute({
    description: 'Get auth',
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                email: { type: 'string' },
              },
            },
          },
        },
      },
    },
  }),
  async (c) => {
    return c.json({
      id: getAccount(c).id,
      email: getAccount(c).email,
    });
  }
);

authRoute.post(
  '/login',
  describeRoute({
    description: 'Login with email and password',
    responses: {
      200: {
        description: 'Success',
      },
      401: {
        description: 'Unauthorized',
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
  validator('json', loginSchema),
  async (c) => {
    const { email, password } = c.req.valid('json');

    const account = await accountRepo.findByPassword(email, password);

    if (!account) {
      return c.body('Invalid email or password', 401);
    }

    const session = await sessionRepo.issue(account.id);

    applySession(c, session);

    return c.body(null);
  }
);

authRoute.post(
  '/register/code',
  describeRoute({
    description:
      'Send otp code to email.\nIn dev mode returns _test_email_url field with url to test email',
    responses: {
      200: {
        description: 'Success',
      },
      403: {
        description: 'Code already sent',
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
  validator('json', codeSchema),
  async (c) => {
    const { email } = c.req.valid('json');

    const hasOtp = await otpService.has(email);

    if (hasOtp) {
      return c.json({ error: 'Code already sent' }, 403);
    }

    const _test_email_url = await emailClient.sendOtp(email);

    return c.json({ _test_email_url });
  }
);

authRoute.post(
  '/register',
  describeRoute({
    description: 'Register account with otp code',
    responses: {
      200: {
        description: 'Success',
      },
      401: {
        description: 'Invalid email or code',
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
  validator('json', registerSchema),
  async (c) => {
    const { email, code, password } = c.req.valid('json');

    if (!otpService.use(email, code)) {
      return c.json({ error: 'Invalid email or code' }, 401);
    }

    const account = await accountRepo.insert(email, password);
    const session = await sessionRepo.issue(account.id);

    applySession(c, session);

    return c.body(null);
  }
);
