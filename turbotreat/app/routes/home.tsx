import { Link } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TurboTreat®" },
    {
      name: "description",
      content: "Welcome to TurboTreat, hosted by Arbor Halloween!",
    },
  ];
}

export default function Home() {
  return (
    <>
      <header className="h-8 px-4 mt-4">
        <img src="/public/unintuit-turbotreat.png" className="h-full" />
      </header>
      <main className="p-4">
        <div className="rounded-lg bg-stone-100 py-10 px-8 text-center">
          <h1 className="text-2xl font-light">
            Ready to file your 2025 treat return? TurboTreat can help you file.
          </h1>
          <p className="text-sm font-light mt-6">
            Get every treat you deserve on your refund, guaranteed*
          </p>
          <Link to="/application">
            <button className="mt-6 rounded-md bg-sky-700 font-medium text-lg text-white w-full py-2">
              File my return
            </button>
          </Link>
        </div>
      </main>
    </>
  );
}
