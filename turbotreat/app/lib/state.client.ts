// Load application state from localStorage
export function loadAppState(): ApplicationState {
  const state = localStorage.getItem("applicationState");
  if (!state) {
    return { state: "unstarted" };
  }
  const parsedState = JSON.parse(state);
  return parsedState as ApplicationState;
}

// Save application state to localStorage
export function setAppState(state: ApplicationState) {
  localStorage.setItem("applicationState", JSON.stringify(state));
}
