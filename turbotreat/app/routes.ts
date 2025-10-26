import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  // All users land on this page when they first arrive. This is a marketing
  // landing page, with a button link that sends you to `/application`.
  index("routes/home.tsx"),
  ...prefix("application", [
    // When users first start their application, they land on this page. The
    // component at this page reads `localStorage`, determines the current
    // correct next step, and then redirects the user to the correct next
    // `/steps/{step}`. This logic exists here in case a user panics and goes
    // back to the landing page, so we can catch them and redirect them to steps
    // already filled.
    index("routes/start.tsx"),
    // Each step's component also contains logic during initialization to read
    // `localStorage`, determined the correct next step, and redirect the user
    // if the correct next step is not the currently loaded step.
    ...prefix("steps", [route("1", "routes/steps/1.tsx")]),
    // At the very end, we present a review screen and submit the application to
    // the database. We then clear the application state from `localStorage`,
    // and the application can no longer be edited.
    route("finish", "routes/submit.tsx"),
  ]),
] satisfies RouteConfig;
