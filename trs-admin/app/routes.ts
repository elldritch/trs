import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  // All users land on this page when they first arrive. This acts as a hub
  // for all admin functionality, and should include a text input to look up
  // an application by ticket ID. Ideally [stretch] shows candy inventory.
  index("routes/dashboard.tsx"),
  // View an application by ticket ID. Ideally [stretch] should flag inconsistencies.
  route("audit", "routes/audit.tsx"),
  route("audit/:ticketId", "routes/audit-application.tsx"),
  // View all appointments. Ideally [stretch] should let admins add new appointment
  // slots and cancel existing ones.
  route("appointments", "routes/appointments.tsx"),
] satisfies RouteConfig;
