import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  ...prefix("file", [
    route("step", "routes/file-treat-return/step.tsx", [
      route("1", "routes/file-treat-return/steps/1.tsx"),
      route("2", "routes/file-treat-return/steps/2.tsx"),
      route("3", "routes/file-treat-return/steps/3.tsx"),
      route("4", "routes/file-treat-return/steps/4.tsx"),
      route("5", "routes/file-treat-return/steps/5.tsx"),
      route("6", "routes/file-treat-return/steps/6.tsx"),
      route("7", "routes/file-treat-return/steps/7.tsx"),
      route("8", "routes/file-treat-return/steps/8.tsx"),
      route("9", "routes/file-treat-return/steps/9.tsx"),
      route("10", "routes/file-treat-return/steps/10.tsx"),
      route("11", "routes/file-treat-return/steps/11.tsx"),
      route("12", "routes/file-treat-return/steps/12.tsx"),
      route("13", "routes/file-treat-return/steps/13.tsx"),
      route("14", "routes/file-treat-return/steps/14.tsx"),
      route("15", "routes/file-treat-return/steps/15.tsx"),
      route("16", "routes/file-treat-return/steps/16.tsx"),
    ]),
    route("finish", "routes/file-treat-return/submit.tsx"),
  ]),
] satisfies RouteConfig;
