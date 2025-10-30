import { Link, Outlet } from "react-router";
import {
  setTreatReturnState,
  treatReturnStartState,
} from "~/lib/treat-return-state.client";
import { useNavigate } from "react-router";

export default function Step() {
  const navigate = useNavigate();
  return (
    <>
      <header className="h-8 px-4 mt-4 mb-2">
        <Link to="/">
          <img src="/unintuit-turbotreat.png" className="h-full" />
        </Link>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
      <footer className="px-4 mt-2 text-center">
        <button
          className="text-blue-500 underline"
          onClick={() => {
            const confirmed = window.confirm(
              "Are you sure? This will clear your answers to every question!"
            );
            if (confirmed) {
              setTreatReturnState(treatReturnStartState);
              navigate("/file/step/1");
            }
          }}
        >
          Start over
        </button>
      </footer>
    </>
  );
}
