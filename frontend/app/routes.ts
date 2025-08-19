import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("routes/projects.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
] satisfies RouteConfig;
