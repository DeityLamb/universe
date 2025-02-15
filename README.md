# Universe test
The repository includes a NestJS monorepo with two microservices  
**universe** and **notifications** that communicate via RabbitMQ.

- **Universe** provides an API for creating, deleting, getting products and collecting metrics.
- **Notifications** logs changes in products.

## Tech Stack
- PostgreSQL
- Prometheus
- RabbitMQ
- Drizzle

## Start a project

```bash
$ npm run start:dev universe
$ npm run start:dev notifications
```

or with docker compose
```bash
# default port 3000 for universe and 3001 for notifications
$ docker compose up 
```

## e2e tests
```bash
npm run test:e2e
```

## Swagger doc
http://localhost:3000/docs
