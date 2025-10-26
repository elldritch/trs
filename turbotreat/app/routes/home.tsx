import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TurboTreat®" },
    { name: "description", content: "Welcome to TurboTreat, hosted by Arbor Halloween!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
