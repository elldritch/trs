import { Outlet, redirect } from "react-router";
import {
  treatReturnStartState,
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";

export function clientLoader() {
  const appState = loadTreatReturnState();
  if (appState.state === "in_progress") {
    return redirect(`/file/step/${appState.currentStep}`);
  } else if (appState.state === "unstarted") {
    setTreatReturnState(treatReturnStartState);
    return redirect("/file/step/1");
  } else {
    console.error("Unknown treat return state", appState);
    setTreatReturnState(treatReturnStartState);
    return redirect("/file/step/1");
  }
}

export default function Start() {
  return <Outlet />;
}
